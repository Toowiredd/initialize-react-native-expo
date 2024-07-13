import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    selectedItem: null,
    detectionArea: { x: 0, y: 0, width: 640, height: 480 },
  },
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setDetectionArea: (state, action) => {
      state.detectionArea = action.payload;
    },
  },
});

export const { setSelectedItem, setDetectionArea } = settingsSlice.actions;
export default settingsSlice.reducer;