import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const submitSectionHeadings = createAsyncThunk(
  "sectionHeadings/submitSectionHeadings",
  async (sections, thunkAPI) => {
    try {
      // 1️⃣ Get existing headings
      const existingRes = await fetch("/api/SectionHeadings/GetSectionHeadings");
      const existingData = await existingRes.json();
      console.log("GetSectionHeadings response:", existingData);

      const existing = existingData?.Data || [];

      // 🟦 Create map for quick lookup: { "SectionName": {...} }
      const existingMap = {};
      existing.forEach((item) => {
        if (item.sectionName) {
          existingMap[item.sectionName.trim()] = item;
        }
      });

      // 2️⃣ Loop through submitted sections
      for (const s of sections) {
        // Payload object
        const payloadObj = {
          sectionName: s.key,
          title: s.title,
          subTitle: s.subtitle,
        };

        // ---- IF EXISTS → UPDATE ----
        if (existingMap[s.key]) {
          const res = await fetch("/api/SectionHeadings/UpdateSectionHeading", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadObj),
          });

          const data = await res.json();
          console.log(`UpdateSectionHeading [${s.key}] response:`, data);

          if (!res.ok || (data.Status && data.Status !== "200")) {
            throw new Error(data.Message || `Update failed for section "${s.key}"`);
          }
        } 
        // ---- IF NOT EXISTS → INSERT ----
        else {
          // API expects an array even for a single item
          const payload = [payloadObj];

          const res = await fetch("/api/SectionHeadings/InsertSectionHeading", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          console.log(`InsertSectionHeading [${s.key}] response:`, data);

          if (!res.ok || (data.Status && data.Status !== "200")) {
            throw new Error(data.Message || `Insert failed for section "${s.key}"`);
          }
        }
      }

      return { success: true };
    } catch (err) {
      console.error("💥 submitSectionHeadings error:", err);
      return thunkAPI.rejectWithValue(err.message || "Request failed");
    }
  }
);

// ============================
// 👉 GET: Fetch Section Headings
// ============================
export const fetchSectionHeadings = createAsyncThunk(
  "sectionHeadings/fetchSectionHeadings",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/SectionHeadings/GetSectionHeadings");

      if (!response.ok) {
        return thunkAPI.rejectWithValue(await response.text());
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  creating: false,
  status: "",
};

const sectionHeadingSlice = createSlice({
  name: "sectionHeadings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 GET
      .addCase(fetchSectionHeadings.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(fetchSectionHeadings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.Data || [];
      })
      .addCase(fetchSectionHeadings.rejected, (state, action) => {
        state.loading = false;
        state.status = `❌ Load failed: ${action.payload}`;
      })

      // 🟦 POST
      .addCase(submitSectionHeadings.pending, (state) => {
        state.creating = true;
        state.status = "";
      })
      .addCase(submitSectionHeadings.fulfilled, (state) => {
        state.creating = false;
        state.status = "✅ Section headings saved successfully!";
      })
      .addCase(submitSectionHeadings.rejected, (state, action) => {
        state.creating = false;
        state.status = `❌ Error: ${action.payload}`;
      });
  },
});

export default sectionHeadingSlice.reducer;
