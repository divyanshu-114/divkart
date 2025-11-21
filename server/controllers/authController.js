import ErrorHandler from "../middlewares/errorMiddleware.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import pool from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";

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
    sendToken(user.rows[0], 201, "User registered successfully", res);
});



export const login = catchAsyncErrors(async(req, res, next) => {});


export const getUser = catchAsyncErrors(async(req, res, next) => {});


export const logout = catchAsyncErrors(async(req, res, next) => {});
