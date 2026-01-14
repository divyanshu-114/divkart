import express from "express";
import { getAllUsers } from "../controllers/adminController";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware";
const router = express.Router();

router.get("/getallusers", isAuthenticated, authorizedRoles("admin"), getAllUsers); // dashboard

export default router;