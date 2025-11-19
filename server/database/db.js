// db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" }); // ensure correct path

const { Client } = pkg;

if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is not set. Check ./config/config.env");
  process.exit(1);
}

const database = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

database.connect()
  .then(() => console.log("Connected to database successfully"))
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });

export default database;
