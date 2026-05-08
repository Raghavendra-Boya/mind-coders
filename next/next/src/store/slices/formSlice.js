// store/slices/formSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Generic async thunk for form submissions
export const submitForm = createAsyncThunk(
  "form/submitForm",
  async ({ endpoint, formData, method = "POST" }, { rejectWithValue }) => {
    try {
      const res = await fetch(endpoint, {
        method,
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
  // Generic form state
  formData: {},
  errors: {},
  loading: false,
  status: "",
  // Form types for different forms
  currentForm: null,
  // Form validation
  isValid: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      const { formType, data } = action.payload;
      state.formData = { ...state.formData, [formType]: data };
    },
    setErrors: (state, action) => {
      const { formType, errors } = action.payload;
      state.errors = { ...state.errors, [formType]: errors };
    },
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload;
    },
    resetForm: (state, action) => {
      const formType = action.payload;
      if (formType) {
        state.formData[formType] = {};
        state.errors[formType] = {};
      } else {
        state.formData = {};
        state.errors = {};
      }
      state.status = "";
    },
    setFormField: (state, action) => {
      const { formType, field, value } = action.payload;
      if (!state.formData[formType]) {
        state.formData[formType] = {};
      }
      state.formData[formType][field] = value;
      // Clear field error when user types
      if (state.errors[formType] && state.errors[formType][field]) {
        state.errors[formType][field] = "";
      }
    },
    setValidation: (state, action) => {
      state.isValid = action.payload;
    },
    clearStatus: (state) => {
      state.status = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitForm.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(submitForm.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "✅ Form submitted successfully!";
        // Reset form data for current form
        if (state.currentForm) {
          state.formData[state.currentForm] = {};
        }
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.loading = false;
        const message = action.payload?.message || action.payload || "Something went wrong.";
        state.status = `❌ Submission failed: ${message}`;
      });
  },
});

export const {
  setFormData,
  setErrors,
  setCurrentForm,
  resetForm,
  setFormField,
  setValidation,
  clearStatus,
} = formSlice.actions;

export default formSlice.reducer;
