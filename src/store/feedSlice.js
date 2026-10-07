import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: [],
    page: 1,
    hasMore: true,
    loading: false,
  },
  reducers: {
    setFeed: (state, action) => {
      state.users = action.payload.users;
      state.page = action.payload.page ?? 1;
      state.hasMore = action.payload.hasMore ?? true;
    },
    appendFeed: (state, action) => {
      state.users = [...state.users, ...action.payload.users];
      state.hasMore = action.payload.hasMore ?? true;
    },
    removeFromFeed: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
    setFeedPage: (state, action) => {
      state.page = action.payload;
    },
    setFeedLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearFeed: (state) => {
      state.users = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
    },
  },
});

export const {
  setFeed,
  appendFeed,
  removeFromFeed,
  setFeedPage,
  setFeedLoading,
  clearFeed,
} = feedSlice.actions;

export default feedSlice.reducer;
