import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Insert episode
export const insertProgramEpisode = createAsyncThunk(
  "programEpisode/insertProgramEpisode",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/ProgramEpisode/InsertProgram",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("API Response:", response.data);
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch episodes
export const fetchProgramEpisodes = createAsyncThunk(
  "programEpisode/fetchProgramEpisodes",
  async (programId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/ProgramEpisode/GetProgramEpisodes?ProgramID=${programId}`);
      return response.data?.EpisodesData || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const programEpisodeSlice = createSlice({
  name: "programEpisode",
  initialState: {
    episodes: [],
    loading: false,
    status: null,
    error: null,
  },
  reducers: {
    resetEpisodeForm: (state) => {
      state.status = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertProgramEpisode.pending, (state) => {
        state.loading = true;
        state.status = null;
        state.error = null;
      })
      .addCase(insertProgramEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "Episode created successfully!";
      })
      .addCase(insertProgramEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create episode.";
      })
      .addCase(fetchProgramEpisodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramEpisodes.fulfilled, (state, action) => {
        state.loading = false;
        state.episodes = action.payload;
      })
      .addCase(fetchProgramEpisodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch episodes.";
      });
  },
});

export const { resetEpisodeForm } = programEpisodeSlice.actions;
export default programEpisodeSlice.reducer;
