import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import pool from "../database/db.js";

export const isAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return next(new ErrorHandler("Please login to access this resource", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if(!decoded){
        return next(new ErrorHandler("Unauthorized", 401));
    }

    const user = await pool.query(`select * from users where id = $1 LIMIT 1`, [decoded.id]);
    req.user = user.rows[0];
    next();
});


export const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}

