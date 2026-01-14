import ErrorHandler from "../middlewares/errorMiddleware.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js";
import pool from "../database/db.js";



export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const totalUsersResult = await pool.query(
        `SELECT COUNT(*) FROM users WHERE role = $1`,
        ["User"]
    );
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    const usersResult = await pool.query(
        `SELECT id, name, email, role, created_at
         FROM users
         WHERE role = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        ["User", limit, offset]
    );

    res.status(200).json({
        success: true,
        totalUsers,
        currentPage: page,
        users: usersResult.rows
    });
});
