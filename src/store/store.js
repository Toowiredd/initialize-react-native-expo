import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import settingsReducer from './settingsSlice';
import countersReducer from './countersSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsReducer,
    counters: countersReducer,
  },
});