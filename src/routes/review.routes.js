
import express from "express";

import {
    viewReviewInvitation,
    createProductReview,
    listPublicReviews
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", listPublicReviews);

router.get("/invitation/:token", viewReviewInvitation);

router.post("/invitation/:token", createProductReview);

export default router;
