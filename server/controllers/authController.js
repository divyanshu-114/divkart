import ErrorHandler from "../middlewares/errorMiddleware.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import pool from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import {generateEmailTemplate} from "../utils/generateForgotPasswordEmailTemplate.js";
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary";


export const register = catchAsyncErrors(async(req, res, next) => {
    const {name, email, password} = req.body;

    if(password.length < 8 ||
        password.length > 16 
     ){
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
     }

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
        // console.log(resetPasswordUrl);
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

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
        const { token } = req.params;
        if (!token) {
            return next(new ErrorHandler("Reset token is required", 400));
        }

        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

        const nowInSeconds = Math.floor(Date.now() / 1000);

        const userResult = await pool.query(
            `SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > to_timestamp($2)`,
            [resetPasswordToken, nowInSeconds]
        );

        if (userResult.rows.length === 0) {
            return next(new ErrorHandler("Invalid reset password token", 400));
        }

        const user = userResult.rows[0];

        // 3) Validate new password fields
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            return next(new ErrorHandler("Please provide password and confirmPassword", 400));
        }

        if (password !== confirmPassword) {
            return next(new ErrorHandler("Password and confirm password do not match", 400));
        }

        if (
            password.length < 8 ||
            password.length > 16 ||
            confirmPassword.length < 8 ||
            confirmPassword.length > 16
        ) {
            return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateResult = await pool.query(
            `UPDATE users
            SET password = $1, reset_password_token = NULL, reset_password_expire = NULL
            WHERE id = $2
            RETURNING *`,
            [hashedPassword, user.id]
        );

        sendToken(updateResult.rows[0], 200, "Password reset successfully", res);
});


export const updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const {currentPassword , newPassword, confirmPassword} = req.body;
    if(!currentPassword || !newPassword || !confirmPassword){
        return next(new ErrorHandler("Please provide all required fields",400))
    }
    const isPasswordMatch = await bcrypt.compare(currentPassword, req.user.password)
    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid current password",400))
    }
    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("Password and confirm password do not match",400))
    }
    if (
            newPassword.length < 8 ||
            newPassword.length > 16 ||
            confirmPassword.length < 8 ||
            confirmPassword.length > 16
        ) {
            return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
        }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(`update users set password = $1 where id = $2`, [hashedPassword, req.user.id]);

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});


export const updateProfile = catchAsyncErrors(async (req, res, next) => {

const name = typeof req.body.name === 'string' ? req.body.name.trim() : req.body.name;
  const email = typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email;

  if (!name || !email) {
    return next(new ErrorHandler("Please provide name and email", 400));
  }
  if (name === "" || email === "") {
    return next(new ErrorHandler("Name and email cannot be empty", 400));
  }

  let avatarData = {};
  if (req.files && req.files.avatar) {
    const { avatar } = req.files;

    if (req.user?.avatar?.public_id) {
        await cloudinary.uploader.destroy(req.user.avatar.public_id);      
    }

    const newProfileImage = await cloudinary.uploader.upload(avatar.tempFilePath, {
      folder: "Ecommerce_avatars",
      width: 150,
      crop: "scale"
    });

    avatarData = {
      public_id: newProfileImage.public_id,
      secure_url: newProfileImage.secure_url
    };
  }

  let user;

if (Object.keys(avatarData).length > 0) {
  // Avatar exists → update name, email, avatar
  user = await pool.query(
    `UPDATE users SET name = $1, email = $2, avatar = $3 WHERE id = $4 RETURNING *`,
    [name, email, avatarData, req.user.id]
  );
} else {
  // No avatar uploaded → update only name & email
  user = await pool.query(
    `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
    [name, email, req.user.id]
  );
}


  const updatedUser = user.rows[0];

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser
  });
});

