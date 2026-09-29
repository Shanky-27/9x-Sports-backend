import supabase from "../config/supabase.js";

export const saveOrder = async (orderData) => {

    const { data, error } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

    if (error) throw error;

    return data;

};

export const getOrdersByUser = async(userId)=>{

    const {data,error}=await supabase
        .from("orders")
        .select("*")
        .eq("user_id",userId)
        .order("created_at",{ascending:false});

    if(error) throw error;

    return data;

};

export const getOrderById=async(id)=>{

    const {data,error}=await supabase
        .from("orders")
        .select("*")
        .eq("id",id)
        .single();

    if(error) throw error;

    return data;

};