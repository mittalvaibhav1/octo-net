import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import appReducer from '../features/appSlice';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
  immutableCheck: false
})

export default configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
  },
  middleware: customizedMiddleware
});
