import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/total-user", UserController.totalUser);

export const UserRoute = router;
