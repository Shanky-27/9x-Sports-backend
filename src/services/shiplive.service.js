import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let jwtToken = null;
let expiresAt = null;
export const getJWT = async () => {

    // Agar token abhi bhi valid hai to wahi use karo
    if (
        jwtToken &&
        expiresAt &&
        new Date(expiresAt) > new Date()
    ) {
        return jwtToken;
    }

    const { data } = await axios.post(
        `${process.env.SHIPLIVE_BASE_URL}/auth/login/apiUser`,
        {
            email: process.env.SHIPLIVE_EMAIL,
            password: process.env.SHIPLIVE_API_TOKEN
        }
    );

    jwtToken = data.token;
    expiresAt = data.expiresAt;

    console.log("✅ New ShipLive JWT Generated");
    console.log("Expires At:", expiresAt);
console.log("EMAIL:", process.env.SHIPLIVE_EMAIL);
console.log("TOKEN:", process.env.SHIPLIVE_API_TOKEN);
console.log("BASE URL:", process.env.SHIPLIVE_BASE_URL);
    return jwtToken;
};
export const createConsignment = async (payload) => {

    const token = await getJWT();

    //payload.shipment.partnerId = 12; // Force Aipex

    const response = await axios.post(
        `${process.env.SHIPLIVE_BASE_URL}/users/orders/create_order`,
        payload,
        {
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json",
                "x-client":"true"
            }
        }
    );

    return response.data;
};


// export const loginShiplive = async () => {
//     if (jwt) return jwt;

//     const { data } = await axios.post(
//         `${process.env.SHIPLIVE_BASE_URL}/auth/login/apiUser`,
//         {
//             email: process.env.SHIPLIVE_EMAIL,
//             password: process.env.SHIPLIVE_API_TOKEN
//         }
//     );

//     jwt = data.token;

//     return jwt;
// };

export const listPickupAddresses = async (page = 1) => {

    const token = await getJWT();

    const response = await axios.get(
        `${process.env.SHIPLIVE_BASE_URL}/users/pickupadd/list/${page}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};


export const createPickupAddress = async (payload) => {

    const token = await getJWT();

    const response = await axios.post(
        `${process.env.SHIPLIVE_BASE_URL}/users/pickupadd/create`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};

export const checkPincodeServiceability = async (payload) => {

    const token = await getJWT();

    const response = await axios.post(
        `${process.env.SHIPLIVE_BASE_URL}/users/pincode/check`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};

export const getBestShippingRate = async (payload) => {

    // Step 1: Check serviceability
    const serviceability = await checkPincodeServiceability({
        ppincode: payload.ppincode,
        dpincode: payload.dpincode
    });

    const carriers =
        serviceability?.serviceability?.commonCarriers || [];

    if (!carriers.length) {
        throw new Error("No courier partner available.");
    }

    // Remove duplicate partnerIds
    const uniqueCarriers = [
        ...new Map(
            carriers.map(item => [item.partnerId, item])
        ).values()
    ];

    // Step 2: Calculate rate for every carrier
    const responses = await Promise.allSettled(

        uniqueCarriers.map(async (carrier) => {

            const body = {
                ...payload,
                partnerId: carrier.partnerId
            };

            const result = await calculateRate(body);

            if (!result.data || !result.data.length)
                return null;

            const rate = result.data[0];

            return {

                carrierName: carrier.carrierName,
                partnerId: carrier.partnerId,
                shipClassId: carrier.shipClassId,

                cod: carrier.cod,
                prepaid: carrier.prepaid,
                oda: carrier.oda,

                mode: rate.mode,
                tatDays: rate.tatDays,

                pickupDate: rate.pickupDate,
                expectedDeliveryDate: rate.expectedDeliveryDate,

                actualWeight: rate.weight,
                chargeableWeight: rate.chargeble_weight,
                weightSlab: rate.weightSlab,

                freight: rate.charges.Freight,
                codCharges: rate.charges.Cod,
                awbCharges: rate.charges.AWB,
                insuranceCharges: rate.charges.FOV,

                total: rate.charges.Total
            };

        })

    );

    const availableRates = responses
        .filter(item => item.status === "fulfilled")
        .map(item => item.value)
        .filter(Boolean);

    availableRates.sort((a, b) => a.total - b.total);

    return {

        pickup: serviceability.pickup,
        delivery: serviceability.delivery,

        recommended: availableRates[0] || null,

        allRates: availableRates

    };

};   
export const calculateRate = async (payload) => {

    const token = await getJWT();

    //payload.partnerId = 12; // Always Aipex

    const response = await axios.post(
        `${process.env.SHIPLIVE_BASE_URL}/users/carrier/rate_calculate`,
        payload,
        {
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            }
        }
    );

    return response.data;
};
export const trackShipment = async (awb) => {

    const token = await getJWT();

    console.log("TRACK URL:",
        `${process.env.SHIPLIVE_BASE_URL}/users/tracking/view`
    );

    console.log("AWB:", awb);

    console.log("TOKEN:",
        token.substring(0,20)
    );


    const response = await axios.get(
        `${process.env.SHIPLIVE_BASE_URL}/users/tracking/view`,
        {
            params:{
                awb: awb
            },
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.data;
};
export const getProductCategories = async () => {

    const token = await getJWT();

    const response = await axios.get(
        `${process.env.SHIPLIVE_BASE_URL}/users/get/product_category`,
        {
            params: {
                value: "all"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};