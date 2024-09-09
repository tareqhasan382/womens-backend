import express from "express";
import { authVerify } from "../../middlewares/authVerify";
import { USER_Role } from "../auth/user.constants";
import { ReviewController } from "./review.controller";
const router = express.Router();

router.post(
  "/create-review",
  authVerify(USER_Role.USER),
  ReviewController.createReview
);
router.get("/reviews/:id", ReviewController.reviews);

export const reviewRoute = router;
