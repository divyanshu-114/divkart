import ErrorHandler from "../middlewares/errorMiddleware.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import pool from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import {generateEmailTemplate} from "../utils/generateForgotPasswordEmailTemplate.js";


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


export const login = catchAsyncErrors(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please provide all required fields", 400));
    }
    const user = await pool.query(
        `select * from users where email = $1`,[email]
    ) 
    if(user.rows.length === 0){
        return next(new ErrorHandler("User not found", 400));
    } 
    const isPasswordMatched = await bcrypt.compare(password, user.rows[0].password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid credentials", 401));
    }
    sendToken(user.rows[0], 201, "User logged in successfully", res);   
});


export const getUser = catchAsyncErrors(async(req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
    
});


export const logout = catchAsyncErrors(async(req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "User logged out successfully"
    });
});



export const forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const {email} = req.body;
    const {frontendUrl} = req.query;
    if(!email){
        return next(new ErrorHandler("Please provide email", 400));
    }
    let userResult = await pool.query(
        `select * from users where email = $1`, [email]
    );
    if(userResult.rows.length === 0){
        return next(new ErrorHandler("User not found", 400));
    }
    const user = userResult.rows[0];
    const {resetToken, hashedToken, resetPasswordExpireTime} = generateResetPasswordToken();

    await pool.query(`update users set reset_password_token = $1, reset_password_expire = to_timestamp($2) 
        where id = $3`, [hashedToken, resetPasswordExpireTime / 1000, user.id]);

        const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

        const message = generateEmailTemplate(resetPasswordUrl)

        try {
            sendEmail({
                email: user.email,
                subject: "Reset Password",
                message
            })
            res.status(200).json({
                success: true,
                message: `A reset password link has been sent to your email address ${user.email}`
            });
        } catch (error) {
            await pool.query(`update users set reset_password_token = null, reset_password_expire = null 
                where id = $1`, [user.id]);
            return next(new ErrorHandler("Failed to send reset password email", 500));
        }

});