import ErrorHandler from "../middlewares/errorMiddleware.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import pool from "../database/db.js";



export const getAllUsers = catchAsyncErrors(async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;

    const totalUsersResult = await pool.query(`select count(*) from users where role = $1`,["User"]);
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    const offset = (page - 1) * 10;
    
    const users = await pool.query(`select * from users where role = $1 order by created_at desc limit $2 offset $3`,["User", 10, offset]);

    res.status(200).json({
        success: true,
        totalUsers,
        currentPage: page,
        users : users.rows
    });

})
