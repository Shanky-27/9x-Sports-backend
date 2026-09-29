import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


export const createRazorpayOrder = async ({
    amount,
    receipt,
    notes = {}
}) => {

    const order = await razorpay.orders.create({

        amount: Math.round(Number(amount) * 100),

        currency: "INR",

        receipt,

        notes

    });

    return order;
};


export const verifyRazorpayPayment = ({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
}) => {

    const body =
        `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpaySignature)
    );
};


export const getRazorpayPayment = async (
    paymentId
) => {

    return await razorpay.payments.fetch(
        paymentId
    );

};


export default razorpay;