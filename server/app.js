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
import Stripe from "stripe";
import pool from "./database/db.js";

const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntentId = event.data.object.id;

      try {
        const paymentUpdate = await pool.query(
          `
          UPDATE payments 
          SET payment_status = 'Paid'
          WHERE payment_intent_id = $1
          RETURNING *
          `,
          [paymentIntentId]
        );

        if (paymentUpdate.rows.length === 0) {
          throw new Error("Payment not found");
        }

        const orderId = paymentUpdate.rows[0].order_id;

        await pool.query(
          `UPDATE orders SET paid_at = NOW() WHERE id = $1`,
          [orderId]
        );

        const { rows: orderedItems } = await pool.query(
          `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
          [orderId]
        );

        for (const item of orderedItems) {
          await pool.query(
            `UPDATE products SET stock = stock - $1 WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }
      } catch (err) {
        console.error("Webhook DB Error:", err);
        return res.status(500).send("Webhook processing failed");
      }
    }

    res.status(200).json({ received: true });
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