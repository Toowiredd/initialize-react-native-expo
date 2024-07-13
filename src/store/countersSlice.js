import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pet_1: { daily: 0, weekly: 0, monthly: 0, allTime: 0 },
  hdpe_2: { daily: 0, weekly: 0, monthly: 0, allTime: 0 },
  aluminum_can: { daily: 0, weekly: 0, monthly: 0, allTime: 0 },
  cardboard_carton: { daily: 0, weekly: 0, monthly: 0, allTime: 0 },
  glass_bottle: { daily: 0, weekly: 0, monthly: 0, allTime: 0 },
};

const countersSlice = createSlice({
  name: 'counters',
  initialState,
  reducers: {
    incrementCount: (state, action) => {
      const { item, amount } = action.payload;
      if (state.hasOwnProperty(item)) {
        state[item].daily += amount;
        state[item].weekly += amount;
        state[item].monthly += amount;
        state[item].allTime += amount;
      }
    },
    incrementManualCount: (state, action) => {
      const { item } = action.payload;
      if (state.hasOwnProperty(item)) {
        state[item].daily += 1;
        state[item].weekly += 1;
        state[item].monthly += 1;
        state[item].allTime += 1;
      }
    },
    resetDailyCounts: (state) => {
      Object.keys(state).forEach(item => {
        state[item].daily = 0;
      });
    },
    resetWeeklyCounts: (state) => {
      Object.keys(state).forEach(item => {
        state[item].weekly = 0;
      });
    },
    resetMonthlyCounts: (state) => {
      Object.keys(state).forEach(item => {
        state[item].monthly = 0;
      });
    },
  },
});

export const { 
  incrementCount, 
  incrementManualCount, 
  resetDailyCounts, 
  resetWeeklyCounts, 
  resetMonthlyCounts 
} = countersSlice.actions;

export default countersSlice.reducer;