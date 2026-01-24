import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAIModal } from "./popupSlice";

/* ================= FETCH ALL PRODUCTS ================= */
export const fetchAllProducts = createAsyncThunk(
  "/product/fetchAll",
  async (
    { availability = "", price = "0-100000", category = "", ratings = "", search = "", page = 1 },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (price) params.append("price", price);
      if (search) params.append("search", search);
      if (availability) params.append("availability", availability);
      if (ratings) params.append("ratings", ratings);
      if (page) params.append("page", page);

      const res = await axiosInstance.get(`/product?${params.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

/* ================= FETCH SINGLE PRODUCT ================= */
export const fetchProductDetails = createAsyncThunk(
  "/product/singleProduct",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/product/singleProduct/${id}`);
      return res.data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

/* ================= POST REVIEW ================= */
export const postReview = createAsyncThunk(
  "/product/post-review",
  async ({ productId, review }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        review
      );
      toast.success(res.data.message);
      return res.data.review;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post review");
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to post review"
      );
    }
  }
);

/* ================= DELETE REVIEW ================= */
export const deleteReview = createAsyncThunk(
  "/product/delete-review",
  async ({ productId }, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/product/delete/review/${productId}`);
      toast.success(res.data.message);
      return res.data.review.id;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete review");
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

/* ================= AI SEARCH ================= */
export const fetchProductWithAI = createAsyncThunk(
  "/product/ai-search",
  async (userPrompt, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/product/ai-search`, {
        userPrompt,
      });
      thunkAPI.dispatch(toggleAIModal());
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "AI search failed");
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "AI search failed"
      );
    }
  }
);

/* ================= SLICE ================= */
const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    productReviews: [],
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH ALL */
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.newProducts = action.payload.newProducts;
        state.topRatedProducts = action.payload.topRatedProducts;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })

      /* FETCH SINGLE */
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.productReviews = action.payload.reviews || [];
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })

      /* POST REVIEW */
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        state.productReviews.unshift(action.payload);
      })
      .addCase(postReview.rejected, (state, action) => {
        state.isPostingReview = false;
        toast.error(action.payload);
      })

      /* DELETE REVIEW */
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        state.productReviews = state.productReviews.filter(
          (review) => review.review_id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isReviewDeleting = false;
        toast.error(action.payload);
      })

      /* AI SEARCH */
      .addCase(fetchProductWithAI.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchProductWithAI.fulfilled, (state, action) => {
        state.aiSearching = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.products.length;
      })
      .addCase(fetchProductWithAI.rejected, (state, action) => {
        state.aiSearching = false;
        toast.error(action.payload);
      });
  },
});

export default productSlice.reducer;
