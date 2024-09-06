import express from "express";
import { ProductController } from "./product.controller";
import { authVerify } from "../../middlewares/authVerify";
import { USER_Role } from "../auth/user.constants";
const router = express.Router();

router.post(
  "/product",
  authVerify(USER_Role.USER, USER_Role.ADMIN),
  ProductController.createProduct
);
// authVerify(USER_Role.USER, USER_Role.ADMIN),
router.get("/products", ProductController.products);

export const ProductRoute = router;
