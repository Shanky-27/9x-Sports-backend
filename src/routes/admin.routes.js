
import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

import {
    listAdminOrders,
    adminOrderDetails
} from "../controllers/admin-order.controller.js";

import {
    adminFinanceSummary
} from "../controllers/admin-finance.controller.js";

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/orders", listAdminOrders);
router.get("/orders/:id", adminOrderDetails);

router.get("/finance/summary", adminFinanceSummary);

export default router;
