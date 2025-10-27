import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./counterSlide"
import userSlide from "./userSlide"
export const store = configureStore({
reducer: {
    counter: counterReducer,
    user: userSlide,
  },
})