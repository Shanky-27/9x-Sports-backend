import express from "express";

import {
    createPaymentOrder,
    verifyPaymentAndCreateOrder
} from "../controllers/payment.controller.js";

import {
    authenticate
} from "../middleware/auth.middleware.js";


const router = express.Router();


router.post(
    "/create-order",
    authenticate,
    createPaymentOrder
);


router.post(
    "/verify-and-create-order",
    authenticate,
    verifyPaymentAndCreateOrder
);


export default router;