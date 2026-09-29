import express from "express";

import {
    reserveStock,
    reserveCart
} from "../controllers/inventory.controller.js";

import {
    authenticate
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/reserve",
    authenticate,
    reserveStock
);

router.post(
    "/reserve-cart",
    authenticate,
    reserveCart
);

export default router;