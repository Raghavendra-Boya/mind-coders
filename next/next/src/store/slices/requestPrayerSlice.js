import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: { fullName: "", mobileNo: "", email: "", location: "", message: "" },
  errors: {},
  loading: false,
  status: "",
  list: [],
  listLoading: false,
  listError: "",
};

export const getRequestPrayers = createAsyncThunk(
  "requestPrayer/getRequestPrayers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/MoreLinks/GetRequestPrayers");
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.Message || `HTTP ${res.status}`);

      // Handle single object or array
      if (!data.UserData) return [];
      return Array.isArray(data.UserData) ? data.UserData : [data.UserData];
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

// Submit prayer request
export const submitPrayerRequest = createAsyncThunk(
  "requestPrayer/submitPrayerRequest",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/MoreLinks/InsertRequestPrayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message || "Failed to submit");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const requestPrayerSlice = createSlice({
  name: "requestPrayer",
  initialState,
  reducers: {
    setFormData(state, action) { state.formData = { ...state.formData, ...action.payload }; },
    setErrors(state, action) { state.errors = { ...state.errors, ...action.payload }; },
    resetForm(state) {
      state.formData = { fullName: "", mobileNo: "", email: "", location: "", message: "" };
      state.errors = {};
      state.status = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit
      .addCase(submitPrayerRequest.pending, (state) => { state.loading = true; state.status = ""; })
      .addCase(submitPrayerRequest.fulfilled, (state) => {
        state.loading = false;
        state.status = "✅ Prayer request sent successfully!";
        state.formData = { fullName: "", mobileNo: "", email: "", location: "", message: "" };
      })
      .addCase(submitPrayerRequest.rejected, (state, action) => {
        state.loading = false;
        state.status = "❌ " + (action.payload || "Failed to submit");
      })
      // Get list
      .addCase(getRequestPrayers.pending, (state) => { state.listLoading = true; state.listError = ""; })
      .addCase(getRequestPrayers.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload || [];
      })
      .addCase(getRequestPrayers.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload || "Failed to fetch requests";
      });
  },
});

export const { setFormData, setErrors, resetForm } = requestPrayerSlice.actions;
export { getRequestPrayers, submitPrayerRequest };
export default requestPrayerSlice.reducer;
