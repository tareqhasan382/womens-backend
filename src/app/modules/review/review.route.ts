import express from "express";
import { authVerify } from "../../middlewares/authVerify";
import { USER_Role } from "../auth/user.constants";
import { ReviewController } from "./review.controller";
const router = express.Router();

router.post(
  "/review",
  authVerify(USER_Role.USER, USER_Role.ADMIN),
  ReviewController.createReview
);
router.get(
  "/reviews",
  authVerify(USER_Role.USER, USER_Role.ADMIN),
  ReviewController.reviews
);

export const reviewRoute = router;
