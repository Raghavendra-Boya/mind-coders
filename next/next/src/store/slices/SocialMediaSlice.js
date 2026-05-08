// /store/slices/SocialMediaSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// in insertSocialMediaLink thunk
export const insertSocialMediaLink = createAsyncThunk(
  "socialMedia/insertSocialMediaLink",
  async (payload) => {
    const formData = new FormData();
    formData.append("SocialMediaName", payload.socialMediaName);
    formData.append("SocialMediaLink", payload.socialMediaLink);
    if (payload.socialMediaIcon) {
      formData.append("SocialMediaIcon", payload.socialMediaIcon);
    }

    const res = await fetch("/api/SocialMediaLinks/InsertSocialMediaLink", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { Status: res.status, success: res.ok, Message: text };
    }
  }
);
const socialMediaSlice = createSlice({
  name: "socialMedia",
  initialState: {},
  reducers: {},
  extraReducers: () => {},
});

export default socialMediaSlice.reducer;