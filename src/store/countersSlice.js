import { createSlice } from '@reduxjs/toolkit';

const countersSlice = createSlice({
  name: 'counters',
  initialState: {
    plastic_bottle: 0,
    aluminum_can: 0,
    cardboard_carton: 0,
  },
  reducers: {
    incrementCount: (state, action) => {
      const { item, amount } = action.payload;
      if (state.hasOwnProperty(item)) {
        state[item] += amount;
      }
    },
  },
});

export const { incrementCount } = countersSlice.actions;
export default countersSlice.reducer;