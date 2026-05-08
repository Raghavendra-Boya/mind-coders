import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// POST: save live broadcast link (admin side)
export const submitLiveBroadcast = createAsyncThunk(
  "liveBroadcast/submitLiveBroadcast",
  async ({ videoLink, linkType }, { rejectWithValue }) => {
    try {
      // Reuse the same contract as backend curl example: JSON body with
      // videoLink and linkType, plus Authorization bearer token.
      const token = localStorage.getItem("jwtToken");

      const res = await fetch("/api/LiveBroadCast/InsertLiveBroadCastLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ videoLink, linkType }),
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
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// GET: fetch live broadcast link for player
export const fetchLiveBroadcastLink = createAsyncThunk(
  "liveBroadcast/fetchLiveBroadcastLink",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/LiveBroadCast/GetLiveBroadCastLink");
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const liveBroadcastSlice = createSlice({
  name: "liveBroadcast",
  initialState: {
    videoLink: "",
    linkType: "",
    loading: false,
    status: "",
  },
  reducers: {
    setLiveBroadcastData: (state, action) => {
      Object.assign(state, action.payload);
    },
    resetLiveBroadcast: (state) => {
      state.videoLink = "";
      state.linkType = "";
      state.status = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // insert
      .addCase(submitLiveBroadcast.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(submitLiveBroadcast.fulfilled, (state) => {
        state.loading = false;
        state.status = "✅ Live Broadcast link saved successfully!";
      })
      .addCase(submitLiveBroadcast.rejected, (state, action) => {
        state.loading = false;
        state.status = `❌ Failed: ${action.payload || "Something went wrong."}`;
      })
      // get
      .addCase(fetchLiveBroadcastLink.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(fetchLiveBroadcastLink.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};

        // Expected shape (from API):
        // {
        //   Status: 200,
        //   Message: "Success.",
        //   UserData: { VideoLink: "...", LinkType: "2", ... }
        // }

        const userData = payload.UserData || {};

        state.videoLink = userData.VideoLink || "";
        state.linkType = userData.LinkType || "";
      })
      .addCase(fetchLiveBroadcastLink.rejected, (state, action) => {
        state.loading = false;
        state.status = ` Failed: ${action.payload || "Something went wrong."}`;
      });
  },
});

export const { setLiveBroadcastData, resetLiveBroadcast } =
  liveBroadcastSlice.actions;
export default liveBroadcastSlice.reducer;