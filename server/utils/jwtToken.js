import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, message, res) => {
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    const cookieMaxAge = Number(process.env.COOKIE_EXPIRES_IN) || 30 * 24 * 60 * 60 * 1000;


    const isProduction = process.env.NODE_ENV === "production";

    res.status(statusCode).cookie("token", token, {
        expires: new Date(Date.now() + cookieMaxAge ),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    }).json({
        success: true,
        user,
        message,
    })
};
