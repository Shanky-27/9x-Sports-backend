import { 
    createConsignment,
    listPickupAddresses,
        checkPincodeServiceability,
    calculateRate,
    getJWT,createPickupAddress,getBestShippingRate,trackShipment,getProductCategories
} from "../services/shiplive.service.js";
import { sendOrderEmail } from "../services/email.service.js";
import { saveOrder } from "../services/order.service.js";

export const createShipment = async (req, res) => {

    try {

        console.log("========== CREATE ORDER ==========");
        console.log(JSON.stringify(req.body, null, 2));

        const shipment = await createConsignment(req.body);
       const savedOrder = await saveOrder({

            user_id: req.user.id || null,

            order_reference: req.body.shipment.orderReference,

            aipex_no: shipment.aipexNo,

            awb: shipment.awb,

            customer_name: req.body.delivery.name,

            customer_email: req.body.delivery.email,

            customer_mobile: req.body.delivery.mobile,

            address_line1: req.body.delivery.address.line1,

            address_line2: req.body.delivery.address.line2,

            address_line3: req.body.delivery.address.line3,

            pincode: req.body.delivery.pincode,

            invoice_value: req.body.shipment.invoiceVal,

            payment_mode: shipment.paymentMode,

            carrier: shipment.carrier,

            service_type: shipment.serviceType,

            status: shipment.message,

            request_payload: req.body,

            response_payload: shipment

        });
        console.log("SAVED ORDER:", savedOrder);
await sendOrderEmail(savedOrder);
        console.log("SUCCESS RESPONSE");
        console.log(JSON.stringify(shipment, null, 2));

        res.json({
            success: true,
            shipment
        });

    } catch (err) {

        console.log("ERROR RESPONSE");

        console.log(err.response?.status);

        console.log(JSON.stringify(err.response?.data, null, 2));

        res.status(500).json({
            success: false,
            error: err.response?.data || err.message
        });

    }

};

export const getPickupList = async (req, res) => {

    try {

        const pickups = await listPickupAddresses(req.params.page);

        res.json({
            success: true,
            pickups
        });

    } catch(err) {

        console.log("PICKUP LIST ERROR:", err.response?.data);

        res.status(500).json({
            success:false,
            error: err.response?.data || err.message
        });
    }
};

export const createPickup = async (req, res) => {
    try {

        const result = await createPickupAddress(req.body);

        res.json({
            success: true,
            result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.response?.data || err.message
        });

    }
};
export const checkServiceability = async(req,res)=>{

    try{

        const result = await checkPincodeServiceability(req.body);

        res.json({
            success:true,
            result
        });

    }catch(err){

        res.status(500).json({
            success:false,
            error:err.response?.data || err.message
        });

    }
};


export const getBestRate = async (req, res) => {

    try {

        const result = await getBestShippingRate(req.body);

        res.json({
            success: true,
            result
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            error: err.response?.data || err.message

        });

    }

}; 
export const getRate = async(req,res)=>{

    try{

        const result = await calculateRate(req.body);

        res.json({
            success:true,
            result
        });

    }catch(err){

        res.status(500).json({
            success:false,
            error:err.response?.data || err.message
        });

    }
};


export const shipLiveLogin = async(req,res)=>{

    try{

        const token = await getJWT();

        res.json({
            success:true,
            token
        });

    }catch(err){

        res.status(500).json({
            success:false,
            error:err.response?.data || err.message
        });

    }

};
export const getTracking = async (req, res) => {
    try {
        const { awb } = req.query;

        if (!awb) {
            return res.status(400).json({
                success: false,
                error: "AWB number is required."
            });
        }

        const result = await trackShipment(awb);

        res.json({
            success: true,
            result
        });

    } catch (err) {
        console.log(err.response?.data);

        res.status(500).json({
            success: false,
            error: err.response?.data || err.message
        });
    }
};

export const fetchProductCategories = async (req, res) => {

    try {

        const result = await getProductCategories();

        res.json({
            success: true,
            result
        });

    } catch (err) {

        console.log(err.response?.data);

        res.status(500).json({
            success: false,
            error: err.response?.data || err.message
        });

    }

};