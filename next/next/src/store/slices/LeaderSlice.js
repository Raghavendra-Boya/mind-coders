"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// TODO: replace with your actual endpoints
const BASE_URL = "/api/Leader";

export const fetchLeaders = createAsyncThunk(
  "leader/fetchLeaders",
  async () => {
    const res = await fetch(`${BASE_URL}/GetLeaders`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch leaders");
    const data = await res.json(); // { Status, Message, LeadersData: [...] }

    // Normalize
    return (data.LeadersData || []).map((l) => {
      const rawImage =
        l.LeaderImageURL ||
        l.LeaderImagePath ||
        l.LeaderImage ||
        l.ImageURL ||
        null;

      return {
        id: l.SNo, // use SNo as id
        sno: l.SNo,
        name: l.Name,
        designation: l.Designation,
        description: l.Description,
        image: rawImage,
        isActive: l.IsActive,
        trDate: l.TrDate,
        updatedDate: l.UpdatedDate,
        deletedDate: l.DeletedDate,
        userId: l.UserID,
        source: l.Source,
      };
    });
  }
);

export const insertLeader = createAsyncThunk(
  "leader/insertLeader",
  async ({ name, designation, description, leaderImage }) => {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Designation", designation);
    formData.append("Description", description);
    if (leaderImage) {
      formData.append("LeaderImage", leaderImage);
    }

    const res = await fetch(`${BASE_URL}/InsertLeader`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to insert leader");
    return await res.json(); // backend response
  }
);

export const deleteLeader = createAsyncThunk(
  "leader/deleteLeader",
  async (sno) => {
    const res = await fetch(`${BASE_URL}/DeleteLeader?leaderID=${sno}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete leader");
    await res.json();
    return { sno };
  }
);

const leaderSlice = createSlice({
  name: "leader",
  initialState: {
    leaders: [],
    loading: false,
    error: null,
    status: null,
  },
  reducers: {
    resetLeaderStatus(state) {
      state.error = null;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchLeaders
      .addCase(fetchLeaders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(fetchLeaders.fulfilled, (state, action) => {
        state.loading = false;
        state.leaders = action.payload;
        state.status = "";
      })
      .addCase(fetchLeaders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leaders";
      })

      // insertLeader (only status; list is refetched in component)
      .addCase(insertLeader.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(insertLeader.fulfilled, (state) => {
        state.loading = false;
        state.status = "Leader inserted successfully";
      })
      .addCase(insertLeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to insert leader";
      })

      // deleteLeader
      .addCase(deleteLeader.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(deleteLeader.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "";
        state.leaders = state.leaders.filter(
          (l) => l.sno !== action.payload.sno
        );
      })
      .addCase(deleteLeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete leader";
      });
  },
});

export const { resetLeaderStatus } = leaderSlice.actions;
export default leaderSlice.reducer;