import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// GET all contact form submissions
export const fetchContactData = createAsyncThunk(
  "contact/fetchContactData",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("/api/GetInTouch/GetGetInTouch");
      if (!res.ok) return thunkAPI.rejectWithValue(await res.text());

      const json = await res.json();
      return json?.data?.GetInTouchData || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// POST form submission
export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async ({ name = "", email = "", phoneNumber = "", message = "", address = "" } = {}, thunkAPI) => {
    try {
      const requestBody = {
        name: String(name),
        email: String(email),
        phoneNumber: String(phoneNumber),
        message: String(message),
        address: String(address)
      };

      console.log('Sending contact form data:', requestBody);

      const res = await fetch("/api/GetInTouch/InsertGetInTouch", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) return thunkAPI.rejectWithValue(await res.text());

      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    data: [],
    loading: false,
    submitting: false,
    formData: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
      address: "",
    },
    status: "",
  },

  reducers: {
    setContactFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetContactForm: (state) => {
      state.formData = {
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
        address: "",
      };
    },
  },

  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchContactData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContactData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchContactData.rejected, (state, action) => {
        state.loading = false;
        state.status = `❌ Error: ${action.payload}`;
      })

      // POST
      .addCase(submitContactForm.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.submitting = false;
        state.status = "✔ Submitted Successfully!";
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.submitting = false;
        state.status = `❌ Submit failed: ${action.payload}`;
      });
  },
});

export const { setContactFormData, resetContactForm } = contactSlice.actions;
export default contactSlice.reducer;
