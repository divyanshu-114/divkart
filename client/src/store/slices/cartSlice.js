import { createSlice } from "@reduxjs/toolkit";

/* ================= LOCAL STORAGE HELPERS ================= */

const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage", error);
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage", error);
  }
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(), // ✅ load cart on app start
  },
  reducers: {
    /* ADD TO CART */
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;

      const existingItem = state.cart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }

      saveCartToStorage(state.cart);
    },

    /* REMOVE FROM CART */
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.product.id !== action.payload
      );

      saveCartToStorage(state.cart);
    },

    /* UPDATE QUANTITY */
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const existingItem = state.cart.find(
        (item) => item.product.id === id
      );

      if (existingItem) {
        existingItem.quantity = quantity;
        saveCartToStorage(state.cart);
      }
    },

    /* CLEAR CART */
    clearCart: (state) => {
      state.cart = [];
      saveCartToStorage([]);
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
