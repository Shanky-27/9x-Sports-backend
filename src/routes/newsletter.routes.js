import express from "express";
import supabase from "../config/supabase.js";
import { sendNewsletterWelcomeEmail } from "../services/email.service.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if email already exists
    const { data: existingSubscriber, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, subscribed")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (findError) {
      console.error("Newsletter lookup error:", findError);

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }

    // Already subscribed
    if (existingSubscriber?.subscribed) {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed to NX.",
      });
    }

    // If previously unsubscribed, subscribe again
    if (existingSubscriber && !existingSubscriber.subscribed) {
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          subscribed: true,
          unsubscribed_at: null,
        })
        .eq("id", existingSubscriber.id);

      if (updateError) {
        console.error("Newsletter resubscribe error:", updateError);

        return res.status(500).json({
          success: false,
          message: "Could not subscribe. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Welcome back to NX!",
      });
    }

    // New subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: normalizedEmail,
          subscribed: true,
        },
      ]);

    if (insertError) {
      console.error("Newsletter insert error:", insertError);

      return res.status(500).json({
        success: false,
        message: "Could not subscribe. Please try again.",
      });
    }
try {
  await sendNewsletterWelcomeEmail(normalizedEmail);
} catch (emailError) {
  console.error("Welcome email failed:", emailError);
}

    return res.status(201).json({
      success: true,
      message: "You're subscribed to NX!",
    });

  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

export default router;
