import {
    getFinanceSummary
} from "../services/admin-finance.service.js";

const isValidDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const date = new Date(`${value}T00:00:00Z`);

    return !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value;
};

export const adminFinanceSummary = async (req, res) => {
    try {
        const startDate = req.query.start_date || "";
        const endDate = req.query.end_date || "";

        if (
            (startDate && !isValidDate(startDate)) ||
            (endDate && !isValidDate(endDate))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD."
            });
        }

        if (startDate && endDate && startDate > endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date cannot be after end date."
            });
        }

        const result = await getFinanceSummary({
            startDate,
            endDate
        });

        return res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error("Admin finance error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch finance summary."
        });
    }
};
