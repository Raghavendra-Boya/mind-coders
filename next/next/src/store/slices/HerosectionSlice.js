import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// GET Hero Section
export const fetchHeroSection = createAsyncThunk(
  "heroSection/fetchHeroSection",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("/api/HeroSection/GetHeroSections");
      if (!res.ok) return thunkAPI.rejectWithValue(await res.text());

      const json = await res.json();
      
      // Sort by TrDate in descending order to get the latest
      const sortedHeroes = [...(json?.data?.HeroSectionsData || [])]
        .sort((a, b) => new Date(b.TrDate) - new Date(a.TrDate));
      
      // Get the latest active hero or first one if none are active
      const latestHero = 
        sortedHeroes.find(item => item.IsActive === "Y") || 
        sortedHeroes[0] || 
        null;

      return latestHero;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// POST / Submit Hero Section
export const submitHeroSection = createAsyncThunk(
  "heroSection/submitHeroSection",
  async (
    { Title, SubTitle, ButtonText, BackgroundMediaType, UploadFile, Image2, Image3, VideoURL },
    thunkAPI
  ) => {
    try {
      const form = new FormData();
      form.append("Title", Title ?? "");
      form.append("SubTitle", SubTitle ?? "");
      form.append("ButtonText", ButtonText ?? "");
      form.append("BackgroundMediaType", BackgroundMediaType ?? "");
      if (UploadFile) form.append("UploadFile", UploadFile);
      if (Image2) form.append("Image2", Image2);
      if (Image3) form.append("Image3", Image3);
      if (VideoURL) form.append("VideoURL", VideoURL);

      const res = await fetch("/api/HeroSection/InsertHeroSection", {
        method: "POST",
        body: form,
      });
      if (!res.ok) return thunkAPI.rejectWithValue(await res.text());

      try { return await res.json(); }
      catch { return { message: "Hero Section saved successfully!" }; }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  data: null,
  formData: {
    Title: "",
    SubTitle: "",
    ButtonText: "",
    BackgroundMediaType: "image",
    UploadFile: null,
    Image2: null,
    Image3: null,
    VideoURL: "",
  },
  loading: false,
  creating: false,
  status: "",
};

const heroSectionSlice = createSlice({
  name: "heroSection",
  initialState,
  reducers: {
    setHeroSectionFormData: (state, action) => { state.formData = { ...state.formData, ...action.payload }; },
    resetHeroSectionForm: (state) => { state.formData = initialState.formData; state.status = ""; },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchHeroSection.pending, (state) => { state.loading = true; state.status = ""; })
      .addCase(fetchHeroSection.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchHeroSection.rejected, (state, action) => { state.loading = false; state.status = `❌ Load failed: ${action.payload}`; })

      // POST
      .addCase(submitHeroSection.pending, (state) => { state.creating = true; state.status = ""; })
      .addCase(submitHeroSection.fulfilled, (state, action) => {
        state.creating = false;
        state.status = action.payload?.message || "✅ Hero Section saved successfully!";
        state.formData = initialState.formData;
      })
      .addCase(submitHeroSection.rejected, (state, action) => {
        state.creating = false;
        state.status = `❌ Save failed: ${action.payload || "Something went wrong."}`;
      });
  },
});

export const { setHeroSectionFormData, resetHeroSectionForm } = heroSectionSlice.actions;
export default heroSectionSlice.reducer;
