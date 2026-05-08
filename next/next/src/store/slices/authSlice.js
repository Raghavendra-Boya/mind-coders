// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Signup form data
  signupFormData: {
    name: "",
    email: "",
    mobileNo: "",
    source: 0,
  },
  // Login form data
  loginFormData: {
    username: "",
    password: "",
  },
  // Auth state
  user: null,
  isAuthenticated: false,
  // Form states
  signupLoading: false,
  loginLoading: false,
  signupErrors: {},
  loginErrors: {},
  signupStatus: "",
  loginStatus: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Signup form actions
    setSignupFormData: (state, action) => {
      state.signupFormData = { ...state.signupFormData, ...action.payload };
    },
    setSignupErrors: (state, action) => {
      state.signupErrors = action.payload;
    },
    resetSignupForm: (state) => {
      state.signupFormData = initialState.signupFormData;
      state.signupErrors = {};
      state.signupStatus = "";
    },
    // Login form actions
    setLoginFormData: (state, action) => {
      state.loginFormData = { ...state.loginFormData, ...action.payload };
    },
    setLoginErrors: (state, action) => {
      state.loginErrors = action.payload;
    },
    resetLoginForm: (state) => {
      state.loginFormData = initialState.loginFormData;
      state.loginErrors = {};
      state.loginStatus = "";
    },
    // Auth actions
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearAuthStatus: (state) => {
      state.signupStatus = "";
      state.loginStatus = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.signupLoading = true;
        state.signupStatus = "";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.signupStatus = "✅ Signup successful!";
        state.signupFormData = initialState.signupFormData;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupLoading = false;
        const message = action.payload?.message || action.payload || "Something went wrong.";
        state.signupStatus = `❌ Signup failed: ${message}`;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginStatus = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.loginStatus = "✅ Login successful!";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loginFormData = initialState.loginFormData;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        const message = action.payload?.message || action.payload || "Invalid credentials.";
        state.loginStatus = `❌ Login failed: ${message}`;
      });
  },
});

export const {
  setSignupFormData,
  setSignupErrors,
  resetSignupForm,
  setLoginFormData,
  setLoginErrors,
  resetLoginForm,
  logout,
  clearAuthStatus,
} = authSlice.actions;

export default authSlice.reducer;
