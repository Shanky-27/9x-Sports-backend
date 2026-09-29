import supabase from "../config/supabase.js";

export const authenticate = async (req, res, next) => {

    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Token missing"
            });

        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error) {

            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });

        }

        req.user = data.user;

        next();

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};