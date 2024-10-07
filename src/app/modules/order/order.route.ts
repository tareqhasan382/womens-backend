import express from "express";

import { OrderController } from "./order.controller";
import { USER_Role } from "../auth/user.constants";
import { authVerify } from "../../middlewares/authVerify";

const router = express.Router();

router.get("/orders", authVerify(USER_Role.USER), OrderController.orders);
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
