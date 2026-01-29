import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

/* ===================== FETCH MY ORDERS ===================== */
export const fetchMyOrders = createAsyncThunk(
  "order/orders/me",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/order/orders/me");
      return res.data.myOrders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

/* ===================== PLACE ORDER (RAZORPAY) ===================== */
export const placeOrder = createAsyncThunk(
  "order/new",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/order/new", data);

      // ⚠️ Payment NOT completed yet
      toast.info("Redirecting to payment...");

      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to place order, try again."
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Order creation failed"
      );
    }
  }
);

/* ===================== SLICE ===================== */
const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,

    placingOrder: false,

    orderStep: 1,          // 1 = Shipping, 2 = Payment
    finalPrice: null,

    razorpayOrder: null,   // Razorpay order object from backend
  },

  reducers: {
    resetOrderStep(state) {
      state.orderStep = 1;
      state.razorpayOrder = null;
      state.finalPrice = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- FETCH MY ORDERS ---------- */
      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state) => {
        state.fetchingOrders = false;
      })

      /* ---------- PLACE ORDER ---------- */
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;

        state.finalPrice = action.payload.total_price;
        state.razorpayOrder = action.payload.razorpayOrder;

        // Move UI to payment step
        state.orderStep = 2;
      })
      .addCase(placeOrder.rejected, (state) => {
        state.placingOrder = false;
      });
  },
});

export default orderSlice.reducer;
export const { resetOrderStep } = orderSlice.actions;
