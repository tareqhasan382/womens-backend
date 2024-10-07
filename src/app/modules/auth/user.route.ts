import express from "express";
import { UserController } from "./user.controller";
import { authVerify } from "../../middlewares/authVerify";
import { USER_Role } from "./user.constants";

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/total-user", UserController.totalUser);
router.get("/profile", authVerify(USER_Role.USER), UserController.profileUser);
router.post("/google", UserController.googleAuth);

export const UserRoute = router;
