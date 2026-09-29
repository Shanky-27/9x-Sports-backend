import supabase from "../config/supabase.js";

export const decreaseProductStock = async (
    productId,
    size,
    quantity
) => {

    const { data, error } = await supabase.rpc(
        "decrease_product_stock",
        {
            p_product_id: productId,
            p_size: size,
            p_quantity: quantity
        }
    );

    if (error) {
        console.error(
            "INVENTORY RPC ERROR:",
            error
        );

        throw error;
    }

    return data;
};
