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
router.get("/products", ProductController.products);
router.get("/flatSale", ProductController.flatSale);
router.get("/product/:id", ProductController.product);
router.delete(
  "/product/:id",
  authVerify(USER_Role.ADMIN),
  ProductController.deleteProduct
);

export const ProductRoute = router;
