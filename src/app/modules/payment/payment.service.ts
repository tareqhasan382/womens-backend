import { sslService } from "../ssl/ssl.service";

const initPayment = async (payload: any) => {
  //console.log("payload:", payload);
  const paymentSession = await sslService.initPayment(payload);
  return paymentSession;
};

export const InitService = {
  initPayment,
};
