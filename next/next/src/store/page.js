import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import formReducer from "./slices/formSlice";
import requestPrayerReducer from "./slices/requestPrayerSlice";
import eventReducer from "./slices/eventSlice";
import liveBroadcastReducer from "./slices/liveBroadcastSlice";
import categoryReducer from "./slices/categorySlice";
import programReducer from "./slices/programSlice";
import programEpisodeReducer from "./slices/programEpisodeSlice"; // existing
import testimonialsRedusce from "./slices/TestimonialSlice";
import heroSectionReducer from "./slices/HerosectionSlice";
import sectionHeadingsReducer from "./slices/SectionHeadingSlice";
import sectionLeaderReducer from "./slices/LeaderSlice";
import socialMediaReducer from "./slices/SocialMediaSlice"
import speakerReducer from "./slices/SpeakerSlice";
import slotBookingReducer from "./slices/SlotBookingSlice"
import mobileSectionsReducer from "./slices/MobileSectionSlice"
import aboutReducer from "./slices/AboutSectionSlice"
import ContactReducer from "./slices/ContactSlice"
import AppReducer from "../store/slices/AppstoreSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    requestPrayer: requestPrayerReducer,
    event: eventReducer,
    liveBroadcast: liveBroadcastReducer,
    category: categoryReducer,
    program: programReducer,
    programEpisode: programEpisodeReducer,
    testimonials: testimonialsRedusce,
    heroSection: heroSectionReducer,
    sectionHeadings: sectionHeadingsReducer,
    leader: sectionLeaderReducer,
    speaker: speakerReducer,
    socialMedia: socialMediaReducer,
    about: aboutReducer,
    slotBooking: slotBookingReducer,
    mobileSections: mobileSectionsReducer,
    contact:ContactReducer,
    appstore:AppReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // safe for FormData usage
    }),
});
