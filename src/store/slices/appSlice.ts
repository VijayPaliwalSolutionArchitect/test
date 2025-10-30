/**
 * App Slice - Manages app-wide state (settings, theme, etc.)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppSettings } from '@/types';

interface AppState {
  settings: AppSettings;
  isOnline: boolean;
  isFirstLaunch: boolean;
  hasSeenOnboarding: boolean;
}

const initialState: AppState = {
  settings: {
    language: 'en',
    theme: 'light',
    notifications: {
      push: true,
      email: true,
      sms: false,
      assignments: true,
      attendance: true,
      fees: true,
      exams: true,
    },
    biometricEnabled: false,
  },
  isOnline: true,
  isFirstLaunch: true,
  hasSeenOnboarding: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    setLanguage: (state, action: PayloadAction<'en' | 'hi' | 'gu'>) => {
      state.settings.language = action.payload;
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.settings.theme = action.payload;
    },
    
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    
    setFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },
    
    setHasSeenOnboarding: (state, action: PayloadAction<boolean>) => {
      state.hasSeenOnboarding = action.payload;
    },
    
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<AppSettings['notifications']>>
    ) => {
      state.settings.notifications = {
        ...state.settings.notifications,
        ...action.payload,
      };
    },
  },
});

export const {
  setSettings,
  setLanguage,
  setTheme,
  setOnlineStatus,
  setFirstLaunch,
  setHasSeenOnboarding,
  updateNotificationSettings,
} = appSlice.actions;

export default appSlice.reducer;
