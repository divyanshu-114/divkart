import express from "express";
import {createProduct, fetchAllproducts} from "../controllers/productController.js";
import {authorizedRoles, isAuthenticated} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/admin/create", isAuthenticated, authorizedRoles("Admin"), createProduct);
router.get("/", fetchAllproducts);

export default router;