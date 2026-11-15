
import {
  getReviewInvitation,
  submitProductReview,
  getPublicReviews,
} from "../services/review.service.js";

export const viewReviewInvitation = async (req, res) => {
  try {
    const result = await getReviewInvitation(req.params.token);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Review invitation error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to load this review invitation.",
    });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const result = await submitProductReview(
      req.params.token,
      req.body
    );

    if (result.error) {
      const status = result.error.includes("already reviewed")
        ? 409
        : 400;

      return res.status(status).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Product review submission error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to submit your review.",
    });
  }
};

export const listPublicReviews = async (req, res) => {
  try {
    const reviews = await getPublicReviews();

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Public reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Unable to fetch reviews.",
    });
  }
};
