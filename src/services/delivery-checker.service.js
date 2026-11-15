
import supabase from "../config/supabase.js";
import { trackShipment } from "./shiplive.service.js";
import { sendReviewInvitation } from "./review-invitation.service.js";

const isDelivered = (tracking) => {
    const statusCode = String(
        tracking?.current_statusCode || ""
    ).trim().toUpperCase();

    const status = String(
        tracking?.current_status || ""
    ).trim().toLowerCase();

    return statusCode === "DL" || /^delivered\b/.test(status);
};

export const checkPendingDeliveries = async () => {
    console.log("Starting hourly ShipLive delivery check...");

    // 1. Fetch shipments not yet marked delivered.
    const { data: orders, error } = await supabase
        .from("orders")
        .select("id, awb, delivery_status")
        .not("awb", "is", null)
        .neq("awb", "")
        .or("delivery_status.is.null,delivery_status.neq.delivered");

    if (error) throw error;

    console.log(`Checking ${orders?.length || 0} shipments...`);

    // 2. Check every pending shipment with ShipLive.
    for (const order of orders || []) {
        try {
            const tracking = await trackShipment(order.awb);

            if (!isDelivered(tracking)) {
                console.log(
                    `AWB ${order.awb}: ${tracking?.current_status || "Status unavailable"}`
                );
                continue;
            }

            const { error: updateError } = await supabase
                .from("orders")
                .update({
                    delivery_status: "delivered",
                    delivered_at: new Date().toISOString()
                })
                .eq("id", order.id);

            if (updateError) throw updateError;

            console.log(`Delivered detected for AWB ${order.awb}`);

        } catch (err) {
            console.error(
                `Delivery check failed for AWB ${order.awb}:`,
                err.response?.data || err.message
            );
        }
    }

    // 3. Find all delivered orders whose review email is still pending.
    const { data: deliveredOrders, error: reviewQueryError } = await supabase
        .from("orders")
        .select("id, order_reference")
        .eq("delivery_status", "delivered")
        .is("review_email_sent_at", null);

    if (reviewQueryError) throw reviewQueryError;

    // 4. Send invitations. Failed invitations can retry next hour.
    for (const order of deliveredOrders || []) {
        try {
            await sendReviewInvitation(order.id);
        } catch (err) {
            console.error(
                `Review email processing failed for ${order.order_reference}:`,
                err.message
            );
        }
    }

    console.log("Hourly delivery and review check completed.");
};
