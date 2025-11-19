import pkg from "pg";
const { Client } = pkg;

const database = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

database.connect()
  .then(() => console.log("Connected to database successfully"))
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });

export default database;


// i am creating a ecoomerce website
