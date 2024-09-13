import axios from "axios";
import config from "../../../config";
import orderModel from "../order/order.model";
import { v4 as uuidv4 } from "uuid";
const initPayment = async (payload: any) => {
  const tran_id = uuidv4();
  try {
    const data = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: payload.totalPrice,
      currency: "BDT",
      tran_id: tran_id,
      success_url: "https://womens-backend.vercel.app/api/payment-success",
      fail_url: "https://womens-backend.vercel.app/api/payment-fail",
      cancel_url: "https://womens-backend.vercel.app/api/payment-cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: payload.products,
      product_category: "Electronic",
      product_profile: "general",
      cus_name: payload.customer.name,
      cus_email: payload.customer.email,
      cus_add1: payload.customer.address,
      cus_phone: payload.customer.phone,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const response = await axios({
      method: "post",
      url: config.ssl.sslPaymentUrl,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    await orderModel.create({ ...payload, transactionId: tran_id });
    return response.data.GatewayPageURL;
  } catch (error) {
    console.log("error:", error);
  }
};

export const sslService = {
  initPayment,
};
