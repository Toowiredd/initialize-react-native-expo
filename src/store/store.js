import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsReducer,
  },
});