import express from "express";
import { 
    createShipment,
 getPickupList,
 checkServiceability,
 getRate,
 shipLiveLogin,createPickup,getBestRate,getTracking,fetchProductCategories
} from "../controllers/shipping.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/shiplive-login", shipLiveLogin);
router.get("/pickups/:page", getPickupList);
router.post("/serviceability", checkServiceability);
router.post("/rate", getRate);
router.post("/best-rate", getBestRate);
router.post("/create-order", authenticate,createShipment);
router.post("/pickup-address", createPickup);
router.get("/tracking/view", getTracking);
router.get("/product-categories", fetchProductCategories);
export default router;