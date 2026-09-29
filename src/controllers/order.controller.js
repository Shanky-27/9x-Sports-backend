import {
    getOrdersByUser,
    getOrderById
} from "../services/order.service.js";

export const myOrders=async(req,res)=>{

    try{

        const orders=await getOrdersByUser(req.user.id);

        res.json({

            success:true,

            orders

        });

    }catch(err){

        res.status(500).json({

            success:false,

            error:err.message

        });

    }

};

export const orderDetails=async(req,res)=>{

    try{

        const order=await getOrderById(req.params.id);

        if(order.user_id!==req.user.id){

            return res.status(403).json({

                success:false,

                message:"Unauthorized"

            });

        }

        res.json({

            success:true,

            order

        });

    }catch(err){

        res.status(500).json({

            success:false,

            error:err.message

        });

    }

};