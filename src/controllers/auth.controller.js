import supabase from "../config/supabase.js";

// Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n========== REGISTER REQUEST ==========");
    console.log("Email:", email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
        options: {
    emailRedirectTo: "http://localhost:3000/auth/callback"
  }
    });

    if (error) {
      console.log("❌ Registration Failed:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.log("✅ Registration Successful");
    console.log("User ID:", data.user?.id);
    console.log("Email:", data.user?.email);
    console.log("=====================================\n");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });

  } catch (err) {
    console.log("❌ Server Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n========== LOGIN REQUEST ==========");
    console.log("Email:", email);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.log("❌ Login Failed:", error.message);

      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    console.log("✅ Login Successful");
    console.log("User ID:", data.user.id);
    console.log("Access Token Generated");
    console.log("==================================\n");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });

  } catch (err) {
    console.log("❌ Server Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("\n======= FORGOT PASSWORD =======");
    console.log("Email:", email);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/reset-password",
    });

    if (error) {
      console.log("❌ Reset Password Failed:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.log("✅ Password Reset Email Sent");
    console.log("==============================\n");

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });

  } catch (err) {
    console.log("❌ Server Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    console.log("\n======= RESET PASSWORD =======");

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.log("❌ Reset Failed:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.log("✅ Password Updated Successfully");
    console.log("==============================\n");

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data,
    });

  } catch (err) {
    console.log("❌ Server Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};