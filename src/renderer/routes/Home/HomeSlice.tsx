import { createSlice } from "@reduxjs/toolkit";
interface HomeSlice {
  currentSelectVersion: number;
}

const initialState: HomeSlice = {
  currentSelectVersion: 0,
};

const HomeSlice = createSlice({
  name: "Home",
  initialState,
  reducers: {
    setCurrentSelectVersion: (state, action) => {
      state.currentSelectVersion = action.payload;
    },
  },
});

export const { setCurrentSelectVersion } = HomeSlice.actions;

export default HomeSlice.reducer;
