import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./counter/user"
export const store = configureStore({
  reducer: {
  user: userReducer
}
})