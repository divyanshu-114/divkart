import pool from "../database/db.js";

export const getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(
            `SELECT c.id, c.quantity, c.product_id, 
                    p.name, p.price, p.description, p.category, p.images, p.stock
             FROM carts c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = $1`,
            [userId]
        );
        
        // Transform result to match frontend expectation: item.product = { ... }
        const cartItems = result.rows.map(row => ({
            id: row.id,
            quantity: row.quantity,
            product: {
                id: row.product_id,
                name: row.name,
                price: row.price,
                description: row.description,
                category: row.category,
                images: row.images,
                stock: row.stock
            }
        }));

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch cart", error: error.message });
    }
};

export const addToCart = async (req, res) => {
    const userId = req.user.id;
    
    const { productId, quantity } = req.body;

    try {
        const existingItem = await pool.query(
            "SELECT * FROM carts WHERE user_id = $1 AND product_id = $2",
            [userId, productId]
        );

        if (existingItem.rows.length > 0) {
            const newQuantity = existingItem.rows[0].quantity + quantity;
            const updateResult = await pool.query(
                "UPDATE carts SET quantity = $1 WHERE id = $2 RETURNING *",
                [newQuantity, existingItem.rows[0].id]
            );
            return res.status(200).json(updateResult.rows[0]);
        } else {
            const insertResult = await pool.query(
                "INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
                [userId, productId, quantity]
            );
            return res.status(201).json(insertResult.rows[0]);
        }
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ message: "Failed to add to cart", error: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const result = await pool.query(
            "UPDATE carts SET quantity = $1 WHERE id = $2 RETURNING *",
            [quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Failed to update cart item", error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM carts WHERE id = $1 RETURNING *",
            [id]
        );

         if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove item", error: error.message });
    }
};

export const clearCart = async (req, res) => {
    const userId = req.user.id;

    try {
        await pool.query("DELETE FROM carts WHERE user_id = $1", [userId]);
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Failed to clear cart", error: error.message });
    }
};
