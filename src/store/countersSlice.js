import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pet_1: { counts: {} },
  hdpe_2: { counts: {} },
  aluminum_can: { counts: {} },
  cardboard_carton: { counts: {} },
  glass_bottle: { counts: {} },
};

const countersSlice = createSlice({
  name: 'counters',
  initialState,
  reducers: {
    incrementCount: (state, action) => {
      const { item, amount, date = new Date().toISOString().split('T')[0] } = action.payload;
      if (state.hasOwnProperty(item)) {
        if (!state[item].counts[date]) {
          state[item].counts[date] = 0;
        }
        state[item].counts[date] += amount;
      }
    },
    incrementManualCount: (state, action) => {
      const { item, date = new Date().toISOString().split('T')[0] } = action.payload;
      if (state.hasOwnProperty(item)) {
        if (!state[item].counts[date]) {
          state[item].counts[date] = 0;
        }
        state[item].counts[date] += 1;
      }
    },
  },
});

export const { 
  incrementCount, 
  incrementManualCount,
} = countersSlice.actions;

// Selectors
export const selectCountsByDateRange = (state, item, startDate, endDate) => {
  const itemCounts = state.counters[item].counts;
  return Object.entries(itemCounts)
    .filter(([date]) => date >= startDate && date <= endDate)
    .reduce((acc, [date, count]) => {
      acc[date] = count;
      return acc;
    }, {});
};

export const selectWeeklyCounts = (state, item, year, weekNumber) => {
  // Implementation needed
};

export const selectMonthlyCounts = (state, item, year, month) => {
  // Implementation needed
};

export const selectYearlyCounts = (state, item, year) => {
  // Implementation needed
};

export default countersSlice.reducer;