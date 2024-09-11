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

export const paymentRoute = router;
