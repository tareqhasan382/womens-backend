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
router.patch(
  "/admin/order/:id",
  authVerify(USER_Role.ADMIN),
  OrderController.updateOrderAdmin
);
router.get(
  "/admin/orders",
  authVerify(USER_Role.ADMIN),
  OrderController.ordersAdmin
);
export const orderRoute = router;
