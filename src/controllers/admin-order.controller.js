
import {
    getAllOrders,
    getAdminOrderById
} from "../services/admin-order.service.js";

export const listAdminOrders = async (req, res) => {
    try {
        const result = await getAllOrders({
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            paymentStatus: req.query.payment_status,
            deliveryStatus: req.query.delivery_status
        });

        return res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error("Admin orders error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders."
        });
    }
};

export const adminOrderDetails = async (req, res) => {
    try {
        const order = await getAdminOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        return res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Admin order details error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch order details."
        });
    }
};
