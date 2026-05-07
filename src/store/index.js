import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import interviewReducer from './slices/interviewSlice';
import uiReducer from './slices/uiSlice';

// Preload plan from sessionStorage so the very first synchronous render
// already has the correct plan — avoids upgrade-banner flash for premium users.
function getPreloadedPlan() {
  if (typeof window === 'undefined') return 'free';
  try {
    return sessionStorage.getItem('demo_plan') || 'free';
  } catch {
    return 'free';
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interview: interviewReducer,
    ui: uiReducer,
  },
  preloadedState: {
    auth: {
      user: null,
      plan: getPreloadedPlan(),
      isAuthed: false,
      onboardingComplete: false,
      planSelected: false,
    },
  },
  devTools: process.env.NODE_ENV !== 'production',
});
