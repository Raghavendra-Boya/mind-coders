import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    fullName: "",
    mobileNo: "",
    email: "",
    location: "",
    slotBookingDate: "",
    slotBookingTime: "",
    message: "",
  },
  loading: false,
  status: "",
  errors: {},
};

// Insert Slot Booking
export const submitSlotBooking = createAsyncThunk(
  "slotBooking/submitSlotBooking",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/MoreLinks/InsertSlotBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok)
        return rejectWithValue(data?.message || "Failed to submit booking");

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const slotBookingSlice = createSlice({
  name: "slotBooking",
  initialState,
  reducers: {
    setFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
    setErrors(state, action) {
      state.errors = action.payload;
    },
    resetForm(state) {
      state.formData = initialState.formData;
      state.errors = {};
      state.status = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(submitSlotBooking.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(submitSlotBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.status =
          action.payload?.message || "✅ Slot booked successfully!";
        state.formData = initialState.formData;
        state.errors = {};
      })
      .addCase(submitSlotBooking.rejected, (state, action) => {
        state.loading = false;
        state.status = "❌ " + (action.payload || "Failed to submit");
      });
  },
});

export const { setFormData, resetForm, setErrors } = slotBookingSlice.actions;
export { submitSlotBooking };
export default slotBookingSlice.reducer;
