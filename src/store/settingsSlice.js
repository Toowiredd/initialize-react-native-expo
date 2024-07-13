import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    selectedItem: null,
    detectionArea: { x: 0, y: 0, width: 100, height: 100 },
  },
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    saveDetectionArea: (state, action) => {
      state.detectionArea = action.payload;
    },
  },
});

export const { setSelectedItem, saveDetectionArea } = settingsSlice.actions;
export const selectSelectedItem = (state) => state.settings.selectedItem;
export const selectDetectionArea = (state) => state.settings.detectionArea;
export default settingsSlice.reducer;