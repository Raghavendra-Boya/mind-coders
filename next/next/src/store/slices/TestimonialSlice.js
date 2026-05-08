import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const submitTestimonial = createAsyncThunk(
  "testimonials/submitTestimonial",
  async ({ TestimonialName, TestimonialText, PersonImage }, thunkAPI) => {
    try {
      const form = new FormData();
      form.append("TestimonialName", TestimonialName);
      form.append("TestimonialText", TestimonialText);
      form.append("PersonImage", PersonImage);

      const response = await fetch("/api/Testimonial/InsertTestimonial", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text);
      }

      try {
        return await response.json();
      } catch {
        const text = await response.text();
        return { message: text };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchTestimonials",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/Testimonial/GetTestimonials", {
        method: "GET",
      });

      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text);
      }

      return await response.json(); // { Status, Message, TestimonialsData: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  formData: { TestimonialName: "", TestimonialText: "", PersonImage: null },
  loading: false,
  creating: false,
  status: "",
  errors: {},
  items: [],
};

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    setTestimonialFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetTestimonialForm: (state) => {
      state.formData = initialState.formData;
      state.status = "";
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.TestimonialsData;
        state.items = Array.isArray(data)
          ? data
          : Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        const message =
          action.payload?.message || action.payload || "Failed to load testimonials.";
        state.status = `❌ Load failed: ${message}`;
      })
      .addCase(submitTestimonial.pending, (state) => {
        state.creating = true;
        state.status = "";
      })
      .addCase(submitTestimonial.fulfilled, (state) => {
        state.creating = false;
        state.status = "✅ Testimonial created successfully!";
        state.formData = initialState.formData;
      })
      .addCase(submitTestimonial.rejected, (state, action) => {
        state.creating = false;
        const message =
          action.payload?.message || action.payload || "Something went wrong.";
        state.status = `❌ Testimonial creation failed: ${message}`;
      });
  },
});

export const { setTestimonialFormData, resetTestimonialForm } = testimonialSlice.actions;
export default testimonialSlice.reducer;