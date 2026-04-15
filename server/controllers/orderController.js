import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import pool from "../database/db.js";
// import { generatePaymentIntent } from "../utils/generatePaymentIntent.js";
import {generateRazorpayOrder} from "../utils/generateRazorpayOrder.js"
import crypto from "crypto";

export const placeNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    full_name,
    state,
    city,
    country,
    address,
    pincode,
    phone,
    orderedItems,
  } = req.body;
  if (
    !full_name ||
    !state ||
    !city ||
    !country ||
    !address ||
    !pincode ||
    !phone
  ) {
    return next(
      new ErrorHandler("Please provide complete shipping details.", 400)
    );
  }

  let items;
  try {
    items = Array.isArray(orderedItems)
      ? orderedItems
      : JSON.parse(orderedItems);
  } catch {
    return next(new ErrorHandler("Invalid order items format.", 400));
  }

  if (!items || items.length === 0) {
    return next(new ErrorHandler("No items in cart.", 400));
  }
  const productIds = items.map((item) => item.product.id);
  const { rows: products } = await pool.query(
    `SELECT id, price, stock, name FROM products WHERE id = ANY($1::uuid[])`,
    [productIds]
  );

  let total_price = 0;
  const values = [];
  const placeholders = [];

  items.forEach((item, index) => {
    const product = products.find((p) => p.id === item.product.id);

    if (!product) {
      return next(
        new ErrorHandler(`Product not found : ${item.product.id}`, 404)
      );
    }

    if (item.quantity > product.stock) {
      return next(
        new ErrorHandler(
          `Only ${product.stock} units available for ${product.name}`,
          400
        )
      );
    }

    const itemTotal = product.price * item.quantity;
    total_price += itemTotal;

    values.push(
      null,
      product.id,
      item.quantity,
      product.price,
      item.product.images[0].url || "",
      product.name
    );

    const offset = index * 6;

    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${
        offset + 5
      }, $${offset + 6})`
    );
  });

  const tax_price = 0.18;
  const shipping_price = total_price >= 50 ? 0 : 2;
  total_price = Math.round(
    total_price + total_price * tax_price + shipping_price
  );

  const orderResult = await pool.query(
    `INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price) VALUES ($1, $2, $3, $4) RETURNING *`,
    [req.user.id, total_price, tax_price, shipping_price]
  );

  const orderId = orderResult.rows[0].id;

  for (let i = 0; i < values.length; i += 6) {
    values[i] = orderId;
  }

  await pool.query(
    `
    INSERT INTO order_items (order_id, product_id, quantity, price, image, title)
    VALUES ${placeholders.join(", ")} RETURNING *
    `,
    values
  );

  await pool.query(
    `
    INSERT INTO shipping_info (order_id, full_name, state, city, country, address, pincode, phone)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `,
    [orderId, full_name, state, city, country, address, pincode, phone]
  );

  let razorpayOrder;

try {
  razorpayOrder = await generateRazorpayOrder(orderId, total_price);
} catch (err) {
  // rollback: delete order (will cascade to order_items, shipping_info, payments)
  await pool.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
  return next(new ErrorHandler("Payment setup failed. Please try again.", 500));
}


  const order = orderResult.rows[0];


res.status(200).json({
  success: true,
  message: "Order placed successfully. Please proceed to payment.",
  order,
  total_price,
  razorpayOrder,
});

});

export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const result = await pool.query(
    `
    SELECT 
 o.*, 
 COALESCE(
 json_agg(
json_build_object(
'order_item_id', oi.id,
'order_id', oi.order_id,
'product_id', oi.product_id,
'quantity', oi.quantity,
'price', oi.price
 )
 ) FILTER (WHERE oi.id IS NOT NULL), '[]'
 ) AS order_items,
 json_build_object(
 'full_name', s.full_name,
 'state', s.state,
 'city', s.city,
 'country', s.country,
 'address', s.address,
 'pincode', s.pincode,
 'phone', s.phone
 ) AS shipping_info
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN shipping_info s ON o.id = s.order_id
WHERE o.id = $1
GROUP BY o.id, s.id;
`,
    [orderId]
  );

  const order = result.rows[0];
  if (!order) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  if (order.buyer_id !== req.user.id && req.user.role !== "Admin") {
    return next(new ErrorHandler("Not authorized to view this order.", 403));
  }

  res.status(200).json({
    success: true,
    message: "Order fetched.",
    orders: order,
  });
});

export const fetchMyOrders = catchAsyncErrors(async (req, res, next) => {
  const result = await pool.query(
    `
        SELECT o.*, COALESCE(
 json_agg(
  json_build_object(
 'order_item_id', oi.id,
 'order_id', oi.order_id,
 'product_id', oi.product_id,
 'quantity', oi.quantity,
 'price', oi.price,
 'image', oi.image,
 'title', oi.title
  ) 
 ) FILTER (WHERE oi.id IS NOT NULL), '[]'
 ) AS order_items,
json_build_object(
 'full_name', s.full_name,
 'state', s.state,
 'city', s.city,
 'country', s.country,
 'address', s.address,
 'pincode', s.pincode,
 'phone', s.phone
 ) AS shipping_info 
 FROM orders o
 LEFT JOIN order_items oi ON o.id = oi.order_id
 LEFT JOIN shipping_info s ON o.id = s.order_id
WHERE o.buyer_id = $1 AND o.paid_at IS NOT NULL
GROUP BY o.id, s.id
        `,
    [req.user.id]
  );

  res.status(200).json({
    success: true,
    message: "All your orders are fetched.",
    myOrders: result.rows,
  });
});

export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
  const result = await pool.query(`
            SELECT o.*,
 COALESCE(json_agg(
 json_build_object(
 'order_item_id', oi.id,
 'order_id', oi.order_id,
 'product_id', oi.product_id,
 'quantity', oi.quantity,
 'price', oi.price,
 'image', oi.image,
 'title', oi.title
)
) FILTER (WHERE oi.id IS NOT NULL), '[]' ) AS order_items, json_build_object(
'full_name', s.full_name,
 'state', s.state,
 'city', s.city,
 'country', s.country,
 'address', s.address,
 'pincode', s.pincode,
 'phone', s.phone 
) AS shipping_info
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN shipping_info s ON o.id = s.order_id
WHERE o.paid_at IS NOT NULL
GROUP BY o.id, s.id
        `);

  res.status(200).json({
    success: true,
    message: "All orders fetched.",
    orders: result.rows,
  });
});

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  if (!status) {
    return next(new ErrorHandler("Provide a valid status for order.", 400));
  }
  const { orderId } = req.params;
  const results = await pool.query(
    `
    SELECT * FROM orders WHERE id = $1
    `,
    [orderId]
  );

  if (results.rows.length === 0) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  const updatedOrder = await pool.query(
    `
    UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *
    `,
    [status, orderId]
  );

  res.status(200).json({
    success: true,
    message: "Order status updated.",
    updatedOrder: updatedOrder.rows[0],
  });
});

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const results = await pool.query(
    `
        DELETE FROM orders WHERE id = $1 RETURNING *
        `,
    [orderId]
  );
  if (results.rows.length === 0) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order deleted.",
    order: results.rows[0],
  });
});



/* ===================== VERIFY RAZORPAY PAYMENT ===================== */
export const verifyPayment = catchAsyncErrors(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new ErrorHandler("Missing payment verification data.", 400));
  }

  // Verify HMAC signature: sha256(order_id + "|" + payment_id, key_secret)
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return next(new ErrorHandler("Payment signature verification failed.", 400));
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Find the order via the Razorpay order ID stored in payments table
    const paymentResult = await client.query(
      `UPDATE payments
       SET payment_status = 'Paid'
       WHERE payment_intent_id = $1 AND payment_status = 'Pending'
       RETURNING order_id`,
      [razorpay_order_id]
    );

    if (!paymentResult.rows.length) {
      // Already paid or not found — still return success (idempotent)
      await client.query("ROLLBACK");
      client.release();
      return res.status(200).json({ success: true, message: "Payment already processed." });
    }

    const orderId = paymentResult.rows[0].order_id;

    // Mark order as paid
    const orderResult = await client.query(
      `UPDATE orders SET paid_at = NOW() WHERE id = $1 RETURNING buyer_id`,
      [orderId]
    );

    if (orderResult.rows.length > 0) {
      const buyerId = orderResult.rows[0].buyer_id;

      // Clear the buyer's cart
      await client.query(`DELETE FROM carts WHERE user_id = $1`, [buyerId]);
    }

    // Decrement stock for each ordered item
    const items = await client.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [orderId]
    );
    for (const item of items.rows) {
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1`,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");
    client.release();

    res.status(200).json({ success: true, message: "Payment verified and order confirmed." });
  } catch (err) {
    await client.query("ROLLBACK");
    client.release();
    throw err;
  }
});

//  Backend Completed