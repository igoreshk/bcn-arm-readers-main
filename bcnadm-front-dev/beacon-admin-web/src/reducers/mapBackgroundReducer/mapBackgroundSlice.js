import { createSlice } from '@reduxjs/toolkit';

const mapBackgroundSlice = createSlice({
  name: 'mapBackground',
  initialState: {
    showMapBackground: true
  },
  reducers: {
    toggleBackground(state) {
      state.showMapBackground = !state.showMapBackground;
    }
  }
});

export const { toggleBackground } = mapBackgroundSlice.actions;

export default mapBackgroundSlice.reducer;
