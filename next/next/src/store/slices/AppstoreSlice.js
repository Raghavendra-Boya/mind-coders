import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// === GET APP STORE LINKS ===
export const getAppstoreLinks = createAsyncThunk(
  "appstore/getAppstoreLinks",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/AppLinks/GetAppLinks");
      if (!response.ok) {
        return thunkAPI.rejectWithValue(await response.text());
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// === INSERT APP STORE LINK ===
export const submitAppstoreLink = createAsyncThunk(
  "appstore/submitAppstoreLink",
  async ({ appName, description, link }, thunkAPI) => {
    try {
      const response = await fetch("/api/AppLinks/InsertAppLink", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appName, description, link }),
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue(await response.text());
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const AppstoreSlice = createSlice({
  name: "appstore",
  initialState: {
    links: [],
    loading: false,
    creating: false,
    status: "",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitAppstoreLink.pending, (state) => {
        state.creating = true;
        state.status = "";
      })
      .addCase(submitAppstoreLink.fulfilled, (state) => {
        state.creating = false;
        state.status = "Saved successfully";
      })
      .addCase(submitAppstoreLink.rejected, (state, action) => {
        state.creating = false;
        state.status = `Failed: ${action.payload}`;
      })
      .addCase(getAppstoreLinks.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAppstoreLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload;
      })
      .addCase(getAppstoreLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = `Failed to load links: ${action.payload}`;
      });
  },
});

export default AppstoreSlice.reducer;
