// database/db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is not set. Check ./config/config.env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Tuned for Neon/serverless: small pool, short idle life, avoid stale connections
  max: 5,
  idleTimeoutMillis: 20000, // Remove idle connections before Neon closes them (~5 min)
  connectionTimeoutMillis: 10000,
});

// Log pool connect
pool.on("connect", () => console.log("Connected to database (Pool)"));
pool.on("error", (err) => {
  // Idle client errors (e.g. ETIMEDOUT) are expected with serverless DBs; log briefly
  if (err.code === "ETIMEDOUT" || err.code === "ECONNRESET" || err.syscall === "read") {
    console.warn("Pool client disconnected (idle):", err.code || err.message);
  } else {
    console.error("Unexpected error on idle pg client", err.message);
  }
});

// Optional: graceful shutdown on app close
const shutdown = async () => {
  console.log("Shutting down DB pool...");
  try {
    await pool.end();
    console.log("DB pool has ended");
    process.exit(0);
  } catch (err) {
    console.error("Error while shutting down DB pool", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (err) => {
  console.error("uncaughtException", err);
  // optionally shutdown gracefully:
  shutdown();
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection", reason);
  // optionally shutdown gracefully:
  // shutdown();
});

export default pool;
