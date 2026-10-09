import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    pendingCount: 0,
  },
  reducers: {
    setPendingCount: (state, action) => {
      state.pendingCount = action.payload;
    },
    decrementPendingCount: (state) => {
      if (state.pendingCount > 0) state.pendingCount -= 1;
    }
  },
});

export const { setPendingCount, decrementPendingCount } = requestsSlice.actions;
export default requestsSlice.reducer;
