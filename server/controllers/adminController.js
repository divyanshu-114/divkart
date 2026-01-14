import ErrorHandler from "../middlewares/errorMiddleware.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import pool from "../database/db.js";



export const getAllUsers = catchAsyncErrors(async(req, res, next) => {
    
})