/**
 * Redux Store Configuration with RTK Query
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import API services
import { authApi } from './slices/authApi';
import { userApi } from './slices/userApi';
import { attendanceApi } from './slices/attendanceApi';
import { assignmentApi } from './slices/assignmentApi';
import { examApi } from './slices/examApi';
import { feeApi } from './slices/feeApi';
import { notificationApi } from './slices/notificationApi';
import { messagingApi } from './slices/messagingApi';
import { timetableApi } from './slices/timetableApi';

// Import reducers
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import offlineReducer from './slices/offlineSlice';

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [assignmentApi.reducerPath]: assignmentApi.reducer,
    [examApi.reducerPath]: examApi.reducer,
    [feeApi.reducerPath]: feeApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [messagingApi.reducerPath]: messagingApi.reducer,
    [timetableApi.reducerPath]: timetableApi.reducer,
    
    // Regular reducers
    auth: authReducer,
    app: appReducer,
    offline: offlineReducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      attendanceApi.middleware,
      assignmentApi.middleware,
      examApi.middleware,
      feeApi.middleware,
      notificationApi.middleware,
      messagingApi.middleware,
      timetableApi.middleware,
    ),
});

// Setup listeners for refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
