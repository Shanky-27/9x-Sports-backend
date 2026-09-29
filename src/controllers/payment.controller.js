import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getRazorpayPayment
} from "../services/razorpay.service.js";

import {
    createConsignment
} from "../services/shiplive.service.js";

import {
    sendOrderEmail
} from "../services/email.service.js";

import {
    saveOrder
} from "../services/order.service.js";


/*
==================================================
CREATE RAZORPAY ORDER
==================================================
*/

export const createPaymentOrder = async (
    req,
    res
) => {

    try {

        const {
            amount,
            receipt
        } = req.body;


        if (
            !amount ||
            Number(amount) <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });

        }


        const order =
            await createRazorpayOrder({

                amount,

                receipt:
                    receipt ||
                    `ORD${Date.now()}`,

                notes: {

                    user_id:
                        req.user.id

                }

            });


        console.log(
            "RAZORPAY ORDER CREATED:",
            order.id
        );


        return res.json({

            success: true,

            order: {

                id: order.id,

                amount: order.amount,

                currency: order.currency,

                receipt: order.receipt

            },

            keyId:
                process.env.RAZORPAY_KEY_ID

        });


    } catch (err) {

        console.error(
            "RAZORPAY CREATE ORDER ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create payment order"

        });

    }

};


/*
==================================================
VERIFY PAYMENT + CREATE SHIPLIVE ORDER
==================================================
*/

export const verifyPaymentAndCreateOrder =
    async (req, res) => {
let paymentSuccessful = false;

        try {

            console.log(
                "========== VERIFY PAYMENT =========="
            );


            const {

                razorpay_payment_id,

                razorpay_order_id,

                razorpay_signature,

                shipmentData,

                cart

            } = req.body;


            /*
            ------------------------------------------
            VALIDATION
            ------------------------------------------
            */

            if (
                !razorpay_payment_id ||
                !razorpay_order_id ||
                !razorpay_signature
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Missing Razorpay payment details"

                });

            }


            /*
            ------------------------------------------
            VERIFY SIGNATURE
            ------------------------------------------
            */

            const valid =
                verifyRazorpayPayment({

                    razorpayOrderId:
                        razorpay_order_id,

                    razorpayPaymentId:
                        razorpay_payment_id,

                    razorpaySignature:
                        razorpay_signature

                });


            if (!valid) {

                console.error(
                    "RAZORPAY SIGNATURE INVALID"
                );


                return res.status(400).json({

                    success: false,

                    message:
                        "Payment verification failed"

                });

            }


            console.log(
                "RAZORPAY SIGNATURE VERIFIED"
            );


            /*
            ------------------------------------------
            GET PAYMENT FROM RAZORPAY
            ------------------------------------------
            */

            const payment =
                await getRazorpayPayment(
                    razorpay_payment_id
                );


            console.log(
                "RAZORPAY PAYMENT STATUS:",
                payment.status
            );


            /*
            ------------------------------------------
            ONLY CAPTURED PAYMENT CAN CREATE ORDER
            ------------------------------------------
            */

            if (
                payment.status !== "captured"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Payment is not captured. Current status: ${payment.status}`

                });

            }
            
                paymentSuccessful= true


            /*
            ------------------------------------------
            EXTRA SAFETY:
            PAYMENT ORDER MUST MATCH
            ------------------------------------------
            */

            if (
                payment.order_id !==
                razorpay_order_id
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment order mismatch"

                });

            }


            /*
            ------------------------------------------
            NOW PAYMENT IS SUCCESSFUL
            ------------------------------------------

            ONLY NOW WE CALL SHIPLIVE
            */


            if (!shipmentData) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Shipment data missing"

                });

            }


            console.log(
                "========== PAYMENT SUCCESS =========="
            );


            console.log(
                "CREATING SHIPLIVE ORDER..."
            );


            /*
            ------------------------------------------
            ADD RAZORPAY DETAILS TO SHIPMENT
            ------------------------------------------
            */

            // shipmentData.payment = {

            //     razorpayPaymentId:
            //         razorpay_payment_id,

            //     razorpayOrderId:
            //         razorpay_order_id

            // };


            /*
            ------------------------------------------
            CREATE SHIPLIVE CONSIGNMENT
            ------------------------------------------
            */

            const shipment =
                await createConsignment(
                    shipmentData
                );


            /*
            ------------------------------------------
            SAVE ORDER
            ------------------------------------------
            */

            const savedOrder =
                await saveOrder({

                    user_id:
                        req.user.id || null,

                    order_reference:
                        shipmentData
                            .shipment
                            .orderReference,

                    aipex_no:
                        shipment.aipexNo,

                    awb:
                        shipment.awb,

                    customer_name:
                        shipmentData
                            .delivery
                            .name,

                    customer_email:
                        shipmentData
                            .delivery
                            .email,

                    customer_mobile:
                        shipmentData
                            .delivery
                            .mobile,

                    address_line1:
                        shipmentData
                            .delivery
                            .address
                            .line1,

                    address_line2:
                        shipmentData
                            .delivery
                            .address
                            .line2,

                    address_line3:
                        shipmentData
                            .delivery
                            .address
                            .line3,

                    pincode:
                        shipmentData
                            .delivery
                            .pincode,

                    invoice_value:
                        shipmentData
                            .shipment
                            .invoiceVal,

                    payment_mode:
                        shipment.paymentMode,

                    carrier:
                        shipment.carrier,

                    service_type:
                        shipment.serviceType,

                    status:
                        shipment.message,

                    request_payload:
                        shipmentData,

                    response_payload:
                        shipment,
                     // =========================
        // RAZORPAY
        // =========================

        razorpay_order_id:
            razorpay_order_id,

        razorpay_payment_id:
            razorpay_payment_id,

        razorpay_signature:
            razorpay_signature,

        payment_status:
            payment.status,
            product_details:
            cart || [],

                });


            console.log(
                "SAVED ORDER:",
                savedOrder
            );


            /*
            ------------------------------------------
            SEND EMAIL
            ------------------------------------------
            */

            await sendOrderEmail(
                savedOrder
            );


            console.log(
                "ORDER EMAIL SENT"
            );


            /*
            ------------------------------------------
            FINAL RESPONSE
            ------------------------------------------
            */

            return res.json({

                success: true,

                payment: {

                    id:
                        razorpay_payment_id,

                    orderId:
                        razorpay_order_id,

                    status:
                        payment.status

                },

                shipment

            });


        } catch (err) {

            console.error(
                "VERIFY PAYMENT / SHIPLIVE ERROR"
            );


            console.error(err);


            /*
            IMPORTANT:
            At this point payment may already be
            successful but ShipLive may have failed.
            */

            return res.status(500).json({

                success: false,

                paymentSuccessful,

                message:
                    "Payment successful, but order creation failed",

                error:
                    err.response?.data ||
                    err.message

            });

        }

    };