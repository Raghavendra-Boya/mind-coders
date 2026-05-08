import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnonymousToken } from "@/utils/auth";

// ✅ Insert Program
export const insertProgram = createAsyncThunk(
  "program/insertProgram",
  async (programData, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("jwtToken");
      if (!token) token = await getAnonymousToken();

      const res = await fetch("/api/Program/InsertProgram", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: programData,
      });

      if (!res.ok) throw new Error("Failed to insert program");

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("InsertProgram error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch all Programs (with episode counts)
export const fetchPrograms = createAsyncThunk(
  "program/fetchPrograms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/Program/GetPrograms");
      if (!res.ok) throw new Error("Failed to fetch programs");

      const data = await res.json();

      // If API already returns ProgramsData, enrich each program with EpisodeCount
      if (Array.isArray(data?.ProgramsData)) {
        const enrichedPrograms = await Promise.all(
          data.ProgramsData.map(async (p) => {
            // Prefer ProgramID if available, otherwise fall back to SNo
            const programId = p.ProgramID ?? p.SNo;
            if (!programId) return { ...p, EpisodeCount: p.EpisodeCount || 0 };

            try {
              const epRes = await fetch(
                `/api/ProgramEpisode/GetProgramEpisodes?ProgramID=${programId}`
              );
              if (!epRes.ok) {
                return { ...p, EpisodeCount: p.EpisodeCount || 0 };
              }

              const epData = await epRes.json();
              const episodes = Array.isArray(epData?.EpisodesData)
                ? epData.EpisodesData
                : [];

              return { ...p, EpisodeCount: episodes.length };
            } catch (err) {
              console.error("FetchProgramEpisodes for count failed:", err);
              return { ...p, EpisodeCount: p.EpisodeCount || 0 };
            }
          })
        );

        return { ...data, ProgramsData: enrichedPrograms };
      }

      // Fallback: return raw data
      return data;
    } catch (error) {
      console.error("FetchPrograms error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const programSlice = createSlice({
  name: "program",
  initialState: {
    loading: false,
    error: null,
    success: false,
    programs: [],
  },
  reducers: {
    resetProgramState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(insertProgram.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(insertProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProgramState } = programSlice.actions;
export default programSlice.reducer;
