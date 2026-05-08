import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* GET: Fetch all mobile sections */
export const fetchMobileSections = createAsyncThunk(
  "mobileSections/fetchMobileSections",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/MobileSection/GetMobileSections");
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) return rejectWithValue(data);

      // API response shape:
      // {
      //   Status: "200",
      //   Message: "Success.",
      //   MobileSectionsData: [ { SNo, CategoryID, Position, ... }, ... ]
      // }

      const list = Array.isArray(data?.MobileSectionsData)
        ? data.MobileSectionsData
        : [];

      // Normalize to a simpler shape the UI can use directly
      return list.map((item) => ({
        id: item.SNo,
        categoryId: item.CategoryID,
        positionNumber: item.Position,
        sectionHeading: item.SectionHeading || item.SectionName || "",
        isActive: item.IsActive,
        trDate: item.TrDate,
        raw: item,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* INSERT: Add a mobile section (expects body: { categoryID, positionNumber }) */
export const insertMobileSection = createAsyncThunk(
  "mobileSections/insertMobileSection",
  async (body, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/MobileSection/InsertMobileSection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) return rejectWithValue(data);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* DELETE: Remove a mobile section by id */
export const deleteMobileSection = createAsyncThunk(
  "mobileSections/deleteMobileSection",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `/api/MobileSection/DeleteMobileSection?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) return rejectWithValue(data);

      // Return id so we can remove it from items
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const MobileSectionSlice = createSlice({
  name: "mobileSections",
  initialState: {
    items: [],
    loading: false,
    error: null,
    successMessage: "",
  },
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchMobileSections.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(fetchMobileSections.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMobileSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load sections";
      })

      /* INSERT */
      .addCase(insertMobileSection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(insertMobileSection.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Section added successfully!";
      })
      .addCase(insertMobileSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Insert failed";
      })

      /* DELETE */
      .addCase(deleteMobileSection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(deleteMobileSection.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (x) => String(x.id) !== String(action.payload)
        );
        state.successMessage = "Section deleted";
      })
      .addCase(deleteMobileSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      });
  },
});

export const { resetStatus } = MobileSectionSlice.actions;
export default MobileSectionSlice.reducer;