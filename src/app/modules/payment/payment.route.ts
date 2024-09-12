import express from "express";
import { authVerify } from "../../middlewares/authVerify";
import { USER_Role } from "../auth/user.constants";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post(
  "/create-payment",
  authVerify(USER_Role.USER, USER_Role.ADMIN),
  PaymentController.createPayment
);
router.post("/payment-success", PaymentController.paymentSuccess);
router.post("/payment-fail", PaymentController.paymentFail);
router.post("/payment-cancel", PaymentController.paymentCancel);

export const paymentRoute = router;
