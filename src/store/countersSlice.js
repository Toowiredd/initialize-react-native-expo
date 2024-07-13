import { createSlice } from '@reduxjs/toolkit';

const countersSlice = createSlice({
  name: 'counters',
  initialState: {
    pet_1: 0,
    hdpe_2: 0,
    aluminum_can: 0,
    cardboard_carton: 0,
    glass_bottle: 0,
  },
  reducers: {
    incrementCount: (state, action) => {
      const { item, amount } = action.payload;
      if (state.hasOwnProperty(item)) {
        state[item] += amount;
      }
    },
    incrementManualCount: (state, action) => {
      const { item } = action.payload;
      if (state.hasOwnProperty(item)) {
        state[item] += 1;
      }
    },
  },
});

export const { incrementCount, incrementManualCount } = countersSlice.actions;
export default countersSlice.reducer;