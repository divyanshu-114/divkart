import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

/* ===================== REGISTER ===================== */
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ===================== LOGIN ===================== */
export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("User Logged In Successfully");
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ===================== GET USER ===================== */
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data.user;
    } catch {
      return thunkAPI.rejectWithValue("Unauthorized");
    }
  }
);

/* ===================== LOGOUT ===================== */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.get("/auth/logout");
      return null;
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ===================== FORGOT PASSWORD ===================== */
export const forgotPassword = createAsyncThunk(
  "auth/forgot/password",
  async ({ email }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        `/auth/password/forgot?frontendUrl=${import.meta.env.VITE_FRONTEND_URL}`,
        { email }
      );
      toast.success(res.data.message);
      return null;
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = createAsyncThunk(
  "auth/password/reset",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/auth/password/reset/${token}`,
        { password, confirmPassword }
      );
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ===================== UPDATE PASSWORD ===================== */
export const updatePassword = createAsyncThunk(
  "auth/password/update",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/password/update", data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);


/* ===================== UPDATE PROFILE ===================== */
export const updateProfile = createAsyncThunk(
  "auth/me/update",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/profile/update", data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ===================== SLICE ===================== */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {
    builder
      /* Register */
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload;
      })
      .addCase(register.rejected, (state) => {
        state.isSigningUp = false;
      })

      /* Login */
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      /* Get User */
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })

      /* Logout */
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })

      /* Forgot Password */
      .addCase(forgotPassword.pending, (state) => {
        state.isRequestingForToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isRequestingForToken = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isRequestingForToken = false;
      })

      /* Reset Password */
      .addCase(resetPassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
        state.authUser = action.payload;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })

      /* Update Password */
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
        state.authUser = action.payload; // ✅ FIX
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })

      /* Update Profile */
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      });
  },
});

export default authSlice.reducer;
