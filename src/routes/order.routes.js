import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
    myOrders,
    orderDetails
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/my-orders", authenticate, myOrders);

router.get("/:id", authenticate, orderDetails);

export default router;