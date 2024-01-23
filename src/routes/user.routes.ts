import express from "express";
import { userLoginHandler } from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import { loginUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post("/login", validateResource(loginUserSchema), userLoginHandler);

export default router;
