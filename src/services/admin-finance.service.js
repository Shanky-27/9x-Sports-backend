
import supabase from "../config/supabase.js";

const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};

const getIndiaDate = (value) =>
    new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date(value));

export const getFinanceSummary = async ({
    startDate = "",
    endDate = ""
} = {}) => {
    let query = supabase
        .from("orders")
        .select(`
            id,
            order_reference,
            created_at,
            customer_name,
            invoice_value,
            payment_status,
            razorpay_payment_id,
            razorpay_amount,
            razorpay_amount_refunded,
            razorpay_method,
            request_payload
        `)
        .order("created_at", { ascending: false });

    if (startDate) {
        query = query.gte(
            "created_at",
            `${startDate}T00:00:00+05:30`
        );
    }

    if (endDate) {
        query = query.lte(
            "created_at",
            `${endDate}T23:59:59.999+05:30`
        );
    }

    const { data, error } = await query;

    if (error) throw error;

    const orders = data || [];

    const summary = {
        totalOrders: orders.length,
        capturedOrders: 0,
        unverifiedOrders: 0,
        otherPaymentOrders: 0,
        grossCollections: 0,
        refunds: 0,
        netCollections: 0,
        productSales: 0,
        shippingCharges: 0,
        discounts: 0,
        handlingCharges: 0,
        packagingCharges: 0,
        orderGrandTotal: 0,
        unverifiedOrderValue: 0
    };

    const dailyMap = {};

    const transactions = orders.map((order) => {
        const cost = order.request_payload?.costBreakdown || {};

        const productSubtotal = toNumber(
            cost.itemsSubtotal ?? order.invoice_value
        );

        const shipping = toNumber(cost.shipping);
        const discount = toNumber(cost.discount);
        const handling = toNumber(cost.handling);
        const packaging = toNumber(cost.packaging);
        const grandTotal = toNumber(cost.grandTotal);

        const captured = order.payment_status === "captured";
        const verifiedAmount = captured
            ? toNumber(order.razorpay_amount)
            : null;

        const refunded = captured
            ? toNumber(order.razorpay_amount_refunded)
            : 0;

        const netReceived = captured
            ? verifiedAmount - refunded
            : null;

        summary.productSales += productSubtotal;
        summary.shippingCharges += shipping;
        summary.discounts += discount;
        summary.handlingCharges += handling;
        summary.packagingCharges += packaging;
        summary.orderGrandTotal += grandTotal;

        if (captured) {
            summary.capturedOrders += 1;
            summary.grossCollections += verifiedAmount;
            summary.refunds += refunded;
        } else if (!order.payment_status) {
            summary.unverifiedOrders += 1;
            summary.unverifiedOrderValue += grandTotal;
        } else {
            summary.otherPaymentOrders += 1;
        }

        const date = getIndiaDate(order.created_at);

        if (!dailyMap[date]) {
            dailyMap[date] = {
                date,
                orders: 0,
                capturedOrders: 0,
                grossCollections: 0,
                refunds: 0,
                netCollections: 0
            };
        }

        const daily = dailyMap[date];
        daily.orders += 1;

        if (captured) {
            daily.capturedOrders += 1;
            daily.grossCollections += verifiedAmount;
            daily.refunds += refunded;
            daily.netCollections += netReceived;
        }

        return {
            id: order.id,
            orderReference: order.order_reference,
            customerName: order.customer_name,
            date: order.created_at,
            paymentStatus: order.payment_status || "unverified",
            paymentMethod: order.razorpay_method || null,
            paymentId: order.razorpay_payment_id || null,
            productSubtotal,
            shipping,
            discount,
            handling,
            packaging,
            otherCharges: cost.otherCharges || [],
            grandTotal,
            payloadAmountPaid: toNumber(cost.amountPaid),
            actualAmountReceived: verifiedAmount,
            refunded,
            netReceived,
            paymentDifference: captured
                ? verifiedAmount - grandTotal
                : null
        };
    });

    summary.netCollections =
        summary.grossCollections - summary.refunds;

    return {
        summary,
        dailyBreakdown: Object.values(dailyMap),
        transactions,
        period: {
            startDate: startDate || null,
            endDate: endDate || null
        }
    };
};
