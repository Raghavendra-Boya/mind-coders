import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnonymousToken } from "@/utils/auth";

// Submit Event
export const submitEvent = createAsyncThunk(
  "event/submitEvent",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwtToken") || (await getAnonymousToken());

      const form = new FormData();
      form.append("EventName", formData.eventName);
      form.append("Description", formData.description);
      form.append("Venue", formData.venue);
      form.append("EventDate", formData.date);
      form.append("EventTime", formData.time);
      form.append("TicketPrice", formData.price);
      form.append("TicketQuantity", formData.quantity);
      if (formData.imageFile) form.append("EventImage", formData.imageFile);

      // include Authorization header when token is present (do not set Content-Type for FormData)
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/Event/InsertEvent", { method: "POST", body: form, headers });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message || data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Events
export const fetchEvents = createAsyncThunk(
  "event/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwtToken") || (await getAnonymousToken());
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/Event/GetEvents", { method: "GET", headers });
      const data = await res.json();

      if (!res.ok) return rejectWithValue(data?.message || "Failed to fetch events");

      // Normalize event list from different possible response shapes
      const events =
        Array.isArray(data?.EventsData) ? data.EventsData :
        Array.isArray(data?.events) ? data.events :
        Array.isArray(data) ? data :
        [];

      return events;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  formData: {
    eventName: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    price: "",
    quantity: "",
    imageFile: null,
  },
  loading: false,
  status: "",
  errors: {},
  events: [],
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEventFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetEventForm: (state) => {
      state.formData = initialState.formData;
      state.status = "";
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEvent.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(submitEvent.fulfilled, (state) => {
        state.loading = false;
        state.status = "✅ Event created successfully!";
        state.formData = initialState.formData;
      })
      .addCase(submitEvent.rejected, (state, action) => {
        state.loading = false;
        state.status = `❌ Event creation failed: ${action.payload || "Unknown error"}`;
      })
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.status = "";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.status = `❌ Failed to fetch events: ${action.payload}`;
      });
  },
});

export const { setEventFormData, resetEventForm } = eventSlice.actions;
export default eventSlice.reducer;
