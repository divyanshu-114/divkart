import express from "express";
import { getAllUsers ,deleteUser , dashboardStats} from "../controllers/adminController";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware";
const router = express.Router();

router.get("/getallusers", isAuthenticated, authorizedRoles("Admin"), getAllUsers); // dashboard
router.delete("/delete/:id", isAuthenticated, authorizedRoles("Admin"), deleteUser);
router.get("/fetch/dashboard-stats", isAuthenticated, authorizedRoles("Admin"), dashboardStats);

export default router; 

