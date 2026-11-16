
import supabase from "../config/supabase.js";

export const getAllOrders = async ({
    page = 1,
    limit = 20,
    search = "",
    paymentStatus = "",
    deliveryStatus = ""
}) => {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    let query = supabase
        .from("orders")
        .select(`
            id,
            order_reference,
            customer_name,
            customer_email,
            customer_mobile,
            invoice_value,
            payment_mode,
            carrier,
            service_type,
            status,
            payment_status,
            delivery_status,
            awb,
            created_at,
            delivered_at
        `, { count: "exact" });

    if (search.trim()) {
        const term = search.trim().replace(/[,%()]/g, "");
        if (term) {
            query = query.or(
                `order_reference.ilike.%${term}%,customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`
            );
        }
    }

    if (paymentStatus) {
        query = query.eq("payment_status", paymentStatus);
    }

    if (deliveryStatus) {
        query = query.eq("delivery_status", deliveryStatus);
    }

    const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) throw error;

    return {
        orders: data || [],
        pagination: {
            page: safePage,
            limit: safeLimit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / safeLimit)
        }
    };
};

export const getAdminOrderById = async (id) => {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;

    return data;
};
