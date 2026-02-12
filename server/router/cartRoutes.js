import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update/:id", updateCartItem);
router.delete("/remove/:id", removeFromCart);
router.delete("/clear", clearCart);

export default router;
