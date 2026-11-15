
import crypto from "crypto";
import supabase from "../config/supabase.js";
import { sendReviewEmail } from "./email.service.js";


const createReviewToken = (orderId, expiresAt) => {
    const payload = Buffer.from(
        JSON.stringify({
            orderId,
            exp: new Date(expiresAt).getTime()
        })
    ).toString("base64url");

    const signature = crypto
        .createHmac("sha256", process.env.REVIEW_TOKEN_SECRET)
        .update(payload)
        .digest("base64url");

    return `${payload}.${signature}`;
};


const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

export const sendReviewInvitation = async (orderId) => {
    if (!process.env.REVIEW_TOKEN_SECRET) {
        throw new Error("REVIEW_TOKEN_SECRET is missing.");
    }
if (process.env.ENABLE_REVIEW_EMAILS !== "true") {
    console.log("Review emails are disabled until the review page is ready.");
    return;
}
    // Claim the order so another scheduler run cannot process it simultaneously.
    const now = new Date();
    const staleClaim = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

    const { data: order, error: claimError } = await supabase
        .from("orders")
        .update({
            review_email_claimed_at: now.toISOString()
        })
        .eq("id", orderId)
        .is("review_email_sent_at", null)
        .or(
            `review_email_claimed_at.is.null,review_email_claimed_at.lt.${staleClaim}`
        )
        .select("*")
        .maybeSingle();

    if (claimError) throw claimError;

    if (!order) {
        console.log(`Review invitation skipped for order ${orderId}.`);
        return;
    }

    try {
        if (!order.customer_email) {
            throw new Error("Customer email is missing.");
        }

        // Reuse an existing invitation when retrying a failed email.
        let { data: invitation, error: invitationError } = await supabase
            .from("review_invitations")
            .select("*")
            .eq("order_id", order.id)
            .maybeSingle();

        if (invitationError) throw invitationError;

        // Create or renew an expired invitation.
        if (
            invitation &&
            new Date(invitation.expires_at).getTime() <= Date.now()
        ) {
            const { error } = await supabase
                .from("review_invitations")
                .delete()
                .eq("id", invitation.id);

            if (error) throw error;

            invitation = null;
        }

        if (!invitation) {
            const expiresAt = new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString();

            const token = createReviewToken(order.id, expiresAt);

            const { data, error } = await supabase
                .from("review_invitations")
                .insert({
                    order_id: order.id,
                    user_id: order.user_id,
                    token_hash: hashToken(token),
                    expires_at: expiresAt
                })
                .select()
                .single();

            if (error) throw error;

            invitation = data;
        }

        // Recreate the same token from the stored expiry date.
        const token = createReviewToken(
            order.id,
            invitation.expires_at
        );

        const reviewUrl =
            `${process.env.FRONTEND_URL}/write-review/${encodeURIComponent(token)}`;

        await sendReviewEmail(order, reviewUrl);

        const { error: updateError } = await supabase
            .from("orders")
            .update({
                review_email_sent_at: new Date().toISOString(),
                review_email_claimed_at: null
            })
            .eq("id", order.id);

        if (updateError) throw updateError;

        console.log(
            `Review invitation completed for order ${order.order_reference}`
        );

    } catch (error) {
        // Release the claim so the next hourly run can retry.
        await supabase
            .from("orders")
            .update({
                review_email_claimed_at: null
            })
            .eq("id", order.id);

        console.error(
            `Review invitation failed for order ${order.order_reference}:`,
            error.message
        );

        throw error;
    }
};



export const generateReviewTestLink = async (orderId) => {
    if (!process.env.REVIEW_TOKEN_SECRET) {
        throw new Error("REVIEW_TOKEN_SECRET is missing.");
    }

    if (!process.env.FRONTEND_URL) {
        throw new Error("FRONTEND_URL is missing.");
    }

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id, order_reference, user_id, delivery_status")
        .eq("id", orderId)
        .single();

    if (orderError) throw orderError;

    if (order.delivery_status !== "delivered") {
        throw new Error("Only delivered orders can receive a review link.");
    }

    let { data: invitation, error } = await supabase
        .from("review_invitations")
        .select("id, order_id, token_hash, expires_at")
        .eq("order_id", order.id)
        .maybeSingle();

    if (error) throw error;

    if (invitation && new Date(invitation.expires_at).getTime() <= Date.now()) {
        const { error: deleteError } = await supabase
            .from("review_invitations")
            .delete()
            .eq("id", invitation.id);

        if (deleteError) throw deleteError;

        invitation = null;
    }

    if (!invitation) {
        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString();

        const token = createReviewToken(order.id, expiresAt);

        const { data, error: insertError } = await supabase
            .from("review_invitations")
            .insert({
                order_id: order.id,
                user_id: order.user_id,
                token_hash: hashToken(token),
                expires_at: expiresAt
            })
            .select("id, order_id, expires_at")
            .single();

        if (insertError) throw insertError;

        invitation = data;
    }

    const token = createReviewToken(order.id, invitation.expires_at);

    return {
        order_reference: order.order_reference,
        review_url: `${process.env.FRONTEND_URL}/write-review/${encodeURIComponent(token)}`,
        expires_at: invitation.expires_at
    };
};
