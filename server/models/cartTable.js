import pool from "../database/db.js";

export async function createCartTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS carts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            product_id UUID NOT NULL,
            quantity INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, product_id)
        );
    `;

    try {
        await pool.query(query);
    } catch (error) {
        console.error("❌ Failed To Create Cart Table.", error);
        process.exit(1);
    }
}
