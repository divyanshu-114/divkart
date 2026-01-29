import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./router/authRoutes.js";
import productRouter from "./router/productRoutes.js";
import adminRouter from "./router/adminRoutes.js";
import orderRouter from "./router/orderRoutes.js";
// import Stripe from "stripe";
import pool from "./database/db.js";
import crypto from "crypto";

const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.post(
  
  "/api/v1/payment/webhook",
  express.raw({ type: "*/*" }),
  async (req, res) => {
    try {

      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!secret) {
        throw new Error("RAZORPAY_WEBHOOK_SECRET is missing in .env");
      }
      const receivedSignature = req.headers["x-razorpay-signature"];

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(req.body)
        .digest("hex");

      if (expectedSignature !== receivedSignature) {
        return res.status(400).send("Invalid signature");
      }

      const event = JSON.parse(req.body.toString("utf8"));

      if (event.event === "payment.captured") {
        const payment = event?.payload?.payment?.entity;

        // Usually this is Razorpay Order ID (order_xxx)
        const razorpayOrderId = payment?.order_id;

        if (!razorpayOrderId) {
          // No order_id attached; don't break webhook
          return res.status(200).json({ status: "ok" });
        }

        // ✅ Idempotent update: only if Pending
        const result = await pool.query(
          `
          UPDATE payments
          SET payment_status = 'Paid'
          WHERE payment_intent_id = $1 AND payment_status = 'Pending'
          RETURNING order_id
          `,
          [razorpayOrderId]
        );

        // Already processed OR payment row not found
        if (!result.rows.length) {
          return res.status(200).json({ status: "ok" });
        }

        const orderId = result.rows[0].order_id;

        await pool.query(`UPDATE orders SET paid_at = NOW() WHERE id = $1`, [
          orderId,
        ]);

        const items = await pool.query(
          `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
          [orderId]
        );

        for (const item of items.rows) {
          await pool.query(
            `
            UPDATE products
            SET stock = stock - $1
            WHERE id = $2 AND stock >= $1
            `,
            [item.quantity, item.product_id]
          );
        }
      }

      return res.status(200).json({ status: "ok" });
    } catch (err) {
      console.error("Razorpay Webhook Error:", err);
      return res.status(200).json({ status: "ok" }); // always 200 so Razorpay doesn't retry forever
    }
  }
);



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/order", orderRouter);

createTables();

app.use(errorMiddleware);

export default app;