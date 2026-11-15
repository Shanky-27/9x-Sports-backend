
import dotenv from "dotenv";
import supabase from "../src/config/supabase.js";
import { generateReviewTestLink } from "../src/services/review-invitation.service.js";

dotenv.config();

const orderReference = process.argv[2];

if (!orderReference) {
    console.error("Usage: node scripts/generate-review-link.js ORDER_REFERENCE");
    process.exit(1);
}

try {
    const { data: order, error } = await supabase
        .from("orders")
        .select("id")
        .eq("order_reference", orderReference)
        .single();

    if (error) throw error;

    const result = await generateReviewTestLink(order.id);

    console.log("\nReview test link generated successfully:\n");
    console.log("Order:", result.order_reference);
    console.log("URL:", result.review_url);
    console.log("Expires:", result.expires_at);
    console.log("\nNo customer email was sent.\n");

    process.exit(0);
} catch (error) {
    console.error("Unable to generate review link:", error.message);
    process.exit(1);
}
