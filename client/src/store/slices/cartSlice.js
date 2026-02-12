import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

/* ================= ASYNC THUNKS ================= */

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/cart");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/cart/add", { productId: product.id, quantity });
      toast.success("Added to cart");
      return { ...res.data, product }; // Combine backend response with product details for store
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCartQuantityAPI = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ id, quantity }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/cart/update/${id}`, { quantity });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  "cart/removeFromCart",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/cart/remove/${id}`);
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const clearCartAPI = createAsyncThunk(
    "cart/clearCart",
    async (_, thunkAPI) => {
      try {
        await axiosInstance.delete("/cart/clear");
        return;
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to clear cart");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  );

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch Cart */
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Add to Cart */
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        const item = action.payload;
        // Verify if we need to merge or if backend handles it.
        // Since we fetch the whole cart usually, or strict updates.
        // For optimisitc UI or simple state update:
        const existingItem = state.cart.find((i) => i.id === item.id);
        if (existingItem) {
            existingItem.quantity = item.quantity;
        } else {
            state.cart.push(item);
        }
      })

      /* Update Quantity */
      .addCase(updateCartQuantityAPI.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const item = state.cart.find((i) => i.id === id);
        if (item) {
          item.quantity = quantity;
        }
      })

      /* Remove from Cart */
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.cart = state.cart.filter((item) => item.id !== action.payload);
      })

      /* Clear Cart */
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.cart = [];
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
