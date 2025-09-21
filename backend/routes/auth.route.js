import express from "express"
import { signup } from "../controllers/auth.controller";

const router = express.Router();

router.get("/signup", signup)
// login logout
export default router