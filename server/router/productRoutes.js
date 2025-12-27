import express from "express";
import {createProduct,
         deleteProduct, 
         deleteReview, 
         fetchAllproducts, 
         fetchSingleProduct, 
         postProductReview, 
         updateProduct} from "../controllers/productController.js";
import {authorizedRoles, isAuthenticated} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/admin/create", 
    isAuthenticated, 
    authorizedRoles("Admin"), 
    createProduct);


router.get("/", fetchAllproducts);

router.put("/admin/update/:productId", 
    isAuthenticated, 
    authorizedRoles("Admin"), 
    updateProduct);

router.delete("/admin/delete/:productId", 
    isAuthenticated, 
    authorizedRoles("Admin"), 
    deleteProduct);

router.get("/singleProduct/:productId", fetchSingleProduct);

router.put("/post-new/review/:productId", isAuthenticated, postProductReview);

router.delete('/delete/review/:productId',isAuthenticated, deleteReview);

export default router;
