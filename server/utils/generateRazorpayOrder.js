import Razorpay from "razorpay";
import pool from "../database/db.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function generateRazorpayOrder(orderId, totalPrice) {
  try {
    const order = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
      receipt: orderId,
    });

    await pool.query(
      `
      INSERT INTO payments (order_id, payment_type, payment_status, payment_intent_id)
      VALUES ($1, 'Online', 'Pending', $2)
      ON CONFLICT (order_id)
      DO UPDATE SET
        payment_status = 'Pending',
        payment_intent_id = EXCLUDED.payment_intent_id,
        created_at = CURRENT_TIMESTAMP
      `,
      [orderId, order.id]
    );

    return {
       key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (err) {
    console.error("generateRazorpayOrder error:", err);
    throw err; // controller will handle
  }
}





