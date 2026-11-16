import "dotenv/config";
import { sendReviewInvitation } from "../src/services/review-invitation.service.js";

const orderId = "06c23ad5-65fa-4053-afe0-4228053e3882";

try {
    console.log("Triggering review email...");
    await sendReviewInvitation(orderId);
    console.log("Review email test completed.");
    process.exit(0);
} catch (error) {
    console.error("Review email test failed:", error.message);
    process.exit(1);
}
