import express from "express";
import { authVerify } from "../../middlewares/authVerify";
import { USER_Role } from "../auth/user.constants";
import { OrderController } from "./order.controller";

const router = express.Router();

router.get(
  "/orders",
  authVerify(USER_Role.USER, USER_Role.ADMIN),
  OrderController.orders
);
export const orderRoute = router;
