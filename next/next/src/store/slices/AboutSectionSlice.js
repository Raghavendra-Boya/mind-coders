// store/slices/AboutSectionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// === SUBMIT About Section (Insert) ===
export const submitAboutSection = createAsyncThunk(
  "about/submitAboutSection",
  async ({ Heading, Description, Image }, thunkAPI) => {
    try {
      const form = new FormData();
      form.append("Heading", Heading);
      form.append("Description", Description);
      form.append("Image", Image);

      const response = await fetch("/api/AboutSection/InsertAboutSection", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue(await response.text());
      }

      const data = await response.json();

      // Re-fetch data after save
      thunkAPI.dispatch(fetchAboutSection());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// === FETCH About Section Data ===
export const fetchAboutSection = createAsyncThunk(
  "about/fetchAboutSection",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/AboutSection/GetAboutSection");

      if (!response.ok) {
        return thunkAPI.rejectWithValue(await response.text());
      }

      return await response.json(); // { Status, Message, AboutSectionsData }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  AboutSectionsData: [],
  loading: false,
  creating: false,
  error: "",
  status: "",
};

const AboutSectionSlice = createSlice({
  name: "about",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === FETCH ===
      .addCase(fetchAboutSection.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAboutSection.fulfilled, (state, action) => {
        state.loading = false;
        state.AboutSectionsData = action.payload?.AboutSectionsData || [];
      })
      .addCase(fetchAboutSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === SUBMIT ===
      .addCase(submitAboutSection.pending, (state) => {
        state.creating = true;
        state.status = "";
      })
      .addCase(submitAboutSection.fulfilled, (state) => {
        state.creating = false;
        state.status = "Successfully Saved 🎉";
      })
      .addCase(submitAboutSection.rejected, (state, action) => {
        state.creating = false;
        state.status = `Failed ❌: ${action.payload}`;
      });
  },
});

export default AboutSectionSlice.reducer;
