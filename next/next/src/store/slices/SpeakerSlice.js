import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch speakers
export const fetchSpeakers = createAsyncThunk(
  "speaker/fetchSpeakers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/Speaker/GetSpeakers");
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data.SpeakersData || [];
    } catch (err) {
      return rejectWithValue({ success: false, message: err.message });
    }
  }
);

// Insert speaker
export const insertSpeaker = createAsyncThunk(
  "speaker/insertSpeaker",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/Speaker/InsertSpeaker", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue({ success: false, message: err.message });
    }
  }
);

// Delete speaker
export const deleteSpeaker = createAsyncThunk(
  "speaker/deleteSpeaker",
  async (userID, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/Speaker/DeleteSpeaker?userID=${userID}`, {
        method: "POST", // must be POST
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return userID;
    } catch (err) {
      return rejectWithValue({ success: false, message: err.message });
    }
  }
);

const speakerSlice = createSlice({
  name: "speaker",
  initialState: {
    speakers: [],
    loading: false,
    status: "",
    error: null,
  },
  reducers: {
    resetSpeakerStatus(state) {
      state.status = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchSpeakers.pending, (state) => {
        state.loading = true;
        state.status = "";
        state.error = null;
      })
      .addCase(fetchSpeakers.fulfilled, (state, action) => {
        state.loading = false;
        state.speakers = action.payload.map((sp) => ({
          id: sp.UserID,
          name: sp.Name,
          role: sp.Role,
          image: sp.ImageURL,
          SNo: sp.SNo,  // Include SNo
          ...sp  // Include all other fields
        }));
        state.status = "✅ Speakers fetched successfully";
      })
      .addCase(fetchSpeakers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch speakers";
        state.status = "❌ Fetch speakers failed";
      })
      // insert
      .addCase(insertSpeaker.pending, (state) => {
        state.loading = true;
        state.status = "";
        state.error = null;
      })
      .addCase(insertSpeaker.fulfilled, (state, action) => {
        state.loading = false;
        state.speakers.push({
          id: action.payload.UserID,
          name: action.payload.Name,
          role: action.payload.Role,
          image: action.payload.ImageURL,
        });
        state.status = "✅ Speaker added successfully";
      })
      .addCase(insertSpeaker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add speaker";
        state.status = "❌ Speaker addition failed";
      })
      // delete
      .addCase(deleteSpeaker.pending, (state) => {
        state.loading = true;
        state.status = "";
        state.error = null;
      })
      .addCase(deleteSpeaker.fulfilled, (state, action) => {
        state.loading = false;
        state.speakers = state.speakers.filter((s) => s.id !== action.payload);
        state.status = "✅ Speaker deleted successfully";
      })
      .addCase(deleteSpeaker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete speaker";
        state.status = "❌ Speaker deletion failed";
      });
  },
});

export const { resetSpeakerStatus } = speakerSlice.actions;
export default speakerSlice.reducer;
