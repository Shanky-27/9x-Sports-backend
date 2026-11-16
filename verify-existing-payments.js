
import "dotenv/config";
import supabaseAdmin from "./src/config/supabase.js";
import { getRazorpayPayment } from "./src/services/razorpay.service.js";

const { data: orders, error } = await supabaseAdmin
  .from("orders")
  .select("order_reference, request_payload")
  .order("created_at", { ascending: false });

if (error) throw error;

for (const order of orders) {
  const paymentId = order.request_payload?.razorpay_payment_id;
  if (!paymentId) continue;

  try {
    const payment = await getRazorpayPayment(paymentId);

    console.log({
      order_reference: order.order_reference,
      status: payment.status,
      amount: payment.amount / 100,
      amount_refunded: (payment.amount_refunded || 0) / 100,
      refund_status: payment.refund_status || "none",
      method: payment.method,
      captured: payment.captured,
      order_match:
        payment.order_id === order.request_payload?.razorpay_order_id
    });
  } catch (error) {
    console.log({
      order_reference: order.order_reference,
      error: error.error?.description || error.message
    });
  }
}
