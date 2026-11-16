
import supabase from "../config/supabase.js";

export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const { data: admin, error } = await supabase
            .from("admin_users")
            .select("id, user_id, role, is_active")
            .eq("user_id", req.user.id)
            .maybeSingle();

        if (error) throw error;

        if (!admin || !admin.is_active) {
            return res.status(403).json({
                success: false,
                message: "Admin access denied."
            });
        }

        const allowedRoles = ["owner", "operations", "accounts"];

        if (!allowedRoles.includes(admin.role)) {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions."
            });
        }

        req.admin = {
            id: admin.id,
            userId: admin.user_id,
            role: admin.role
        };

        next();

    } catch (error) {
        console.error("Admin authorization error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to verify admin permissions."
        });
    }
};
