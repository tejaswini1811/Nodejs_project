import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '@/redux/features/authSlice';
import userReducer from '@/redux/features/userSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer
  },
})
export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppselector: TypedUseSelectorHook<RootState> = useSelector