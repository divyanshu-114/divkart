// utils/createTables.js
import database from "../database/db.js";
import { createOrdersTable } from "../models/ordersTable.js";
import { createOrderItemTable } from "../models/orderItemsTable.js";
import { createProductsTable } from "../models/productTable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { createShippingInfoTable } from "../models/shippinginfoTable.js";
import { createPaymentsTable } from "../models/paymentsTable.js";
import { createUserTable } from "../models/userTable.js";

export const createTables = async () => {
  try {
    // 1) ensure extension for gen_random_uuid()
    // await database.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    // console.log("✅ Extension pgcrypto ensured");

    // 2) create tables in dependency-safe order
    await createUserTable();            // users first (no deps)
    await createProductsTable();        // products depends on users (created_by)
    await createOrdersTable();          // orders depends on users
    await createOrderItemTable();       // order_items depends on orders & products
    await createProductReviewsTable();  // reviews depend on products & users
    await createShippingInfoTable();    // shipping info (usually depends on orders)
    await createPaymentsTable();        // payments (depends on orders)

    console.log("✅ All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    // In dev you may want to keep process alive to debug; use exit in CI/production if desired
    process.exit(1);
  }
};
