
import crypto from "crypto";
import supabase from "../config/supabase.js";

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const verifyToken = (token) => {
    if (!process.env.REVIEW_TOKEN_SECRET) {
        throw new Error("Review token secret is not configured.");
    }

    const parts = String(token || "").split(".");

    if (parts.length !== 2) return null;

    const [payload, signature] = parts;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.REVIEW_TOKEN_SECRET)
        .update(payload)
        .digest("base64url");

    const actual = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (
        actual.length !== expected.length ||
        !crypto.timingSafeEqual(actual, expected)
    ) {
        return null;
    }

    try {
        const decoded = JSON.parse(
            Buffer.from(payload, "base64url").toString("utf8")
        );

        if (
            !decoded.orderId ||
            !Number.isFinite(decoded.exp) ||
            decoded.exp <= Date.now()
        ) {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
};

const getOrderProducts = (order) => {
    const products =
        order.product_details ||
        order.request_payload?.cart ||
        [];

    if (!Array.isArray(products)) return [];

    return products.map((product) => ({
        product_id: String(product.id ?? product.product_id ?? ""),
        product_name: String(product.name ?? product.product_name ?? "NX Product"),
        product_image: product.image ?? product.image_url ?? null,
        size: product.size ?? null,
        quantity: Number(product.qty ?? product.quantity ?? 1)
    })).filter(product => product.product_id);
};

const getValidInvitation = async (token) => {
    const decoded = verifyToken(token);

    if (!decoded) {
        return { error: "This review link is invalid or has expired." };
    }

const { data: invitation, error } = await supabase
    .from("review_invitations")
    .select("id, order_id, user_id, token_hash, expires_at")
    .eq("order_id", decoded.orderId)
    .eq("token_hash", hashToken(token))
    .maybeSingle();

if (error) throw error;

if (!invitation || new Date(invitation.expires_at).getTime() <= Date.now()) {
    return { error: "This review link is invalid or has expired." };
}

const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, order_reference, customer_name, product_details, request_payload, delivery_status")
    .eq("id", invitation.order_id)
    .single();

if (orderError) throw orderError;

if (order.delivery_status !== "delivered") {
    return { error: "This order is not marked as delivered yet." };
}

return { invitation, order };
};

export const getReviewInvitation = async (token) => {
    const result = await getValidInvitation(token);

    if (result.error) return result;

    const products = getOrderProducts(result.order);

    const { data: existingReviews, error } = await supabase
        .from("reviews")
        .select("product_id")
        .eq("order_id", result.order.id);

    if (error) throw error;

    const reviewedIds = new Set(
        (existingReviews || []).map(review => String(review.product_id))
    );

    return {
    success: true,
    order: {
        order_reference: result.order.order_reference,
        customer_name: result.order.customer_name
    },
    products: products.map(product => ({
        id: product.product_id,
        name: product.product_name,
        image: product.product_image,
        size: product.size,
        quantity: product.quantity,
        already_reviewed: reviewedIds.has(product.product_id)
    }))
};
};

export const submitProductReview = async (token, input) => {
    const result = await getValidInvitation(token);

    if (result.error) return result;

    const rating = Number(input.rating);
    const comment = String(input.comment || "").trim();
    const productId = String(input.product_id || "");

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return { error: "Please select a rating between 1 and 5." };
    }

    if (comment.length < 5 || comment.length > 1000) {
        return { error: "Your review must be between 5 and 1000 characters." };
    }

    const product = getOrderProducts(result.order)
        .find(item => item.product_id === productId);

    if (!product) {
        return { error: "This product does not belong to this order." };
    }

    const { data, error } = await supabase
        .from("reviews")
        .insert({
            order_id: result.order.id,
            user_id: result.order.user_id,
            product_id: product.product_id,
            product_name: product.product_name,
            product_image: product.product_image,
            customer_name: result.order.customer_name || "NX Customer",
            rating,
            comment,
            is_approved: false
        })
        .select("id, rating, comment, created_at")
        .single();

    if (error) {
        if (error.code === "23505") {
            return { error: "You have already reviewed this product." };
        }
        throw error;
    }

    return {
        success: true,
        message: "Thank you! Your review has been submitted for approval.",
        review: data
    };
};


export const getPublicReviews = async () => {
    const { data, error } = await supabase
        .from("reviews")
        .select(`
            id,
            product_id,
            product_name,
            product_image,
            customer_name,
            rating,
            comment,
            created_at
        `)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) throw error;

    return data || [];
};

