import ErrorHandler from "../middlewares/errorMiddleware";
import {catchAsyncErrors} from "../middlewares/catchAsyncError";
import pool from "../database/db";
import bcrypt from "bcryptjs";

export const register = catchAsyncErrors(async(req, res, next) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return next(new ErrorHandler("Please provide all required fields", 400));
    }
    const isAlreadyRegistered = await pool.query(
        `select * from users where email = $1`,[email]
    )
    if(isAlreadyRegistered.rows.length > 0){
        return next(new ErrorHandler("User already exists", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await pool.query(
        `insert into users (name, email, password) values ($1, $2, $3) returning *`,
        [name, email, hashedPassword]
    );
});


export const login = catchAsyncErrors(async(req, res, next) => {});


export const getUser = catchAsyncErrors(async(req, res, next) => {});


export const logout = catchAsyncErrors(async(req, res, next) => {});
