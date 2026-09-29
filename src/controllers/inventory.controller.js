import { supabaseAdmin } from "../config/supabase.js";

export const reserveStock = async (req, res) => {
    try {
        const {
            productId,
            size,
            quantity,
            orderReference
        } = req.body;

        if (!productId || !size || !quantity || !orderReference) {
            return res.status(400).json({
                success: false,
                message: "Missing inventory details"
            });
        }

        const { data, error } = await supabaseAdmin.rpc(
            "reserve_product_stock",
            {
                p_user_id: req.user.id,
                p_product_id: productId,
                p_size: size,
                p_quantity: quantity,
                p_order_reference: orderReference
            }
        );

        if (error) {
            console.error("RESERVE STOCK ERROR:", error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.json({
            success: true,
            reservationId: data
        });

    } catch (err) {
        console.error("RESERVE STOCK ERROR:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
export const reserveCart = async (req, res) => {
    try {
        const { cart, orderReference } = req.body;

        if (!cart || !Array.isArray(cart) || !cart.length) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const reservations = [];

        for (const item of cart) {

            const { data, error } = await supabaseAdmin.rpc(
                "reserve_product_stock",
                {
                    p_user_id: req.user.id,
                    p_product_id: Number(item.id),
                    p_size: String(item.size),
                    p_quantity: Number(item.qty || 1),
                    p_order_reference: orderReference
                }
            );

            if (error) {
                throw new Error(
                    `${item.name} size ${item.size}: ${error.message}`
                );
            }

            reservations.push(data);
        }

        return res.json({
            success: true,
            reservations
        });

    } catch (err) {

        console.error("RESERVE CART ERROR:", err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
