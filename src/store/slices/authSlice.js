import { createSlice } from '@reduxjs/toolkit';

// NOTE: Only non-sensitive metadata (user object, plan, flags) stored in Redux.
// JWT tokens are stored in SameSite=Strict cookies managed by src/lib/tokens.js.
const initialState = {
  user: null,       // { id, name, email, first_name, last_name, avatar_url }
  plan: 'free',     // 'free' | 'standard' | 'premium'
  isAuthed: false,
  onboardingComplete: false,
  planSelected: false, // true once user chooses a plan during onboarding
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.plan = action.payload.plan ?? action.payload.user?.plan ?? 'free';
      state.isAuthed = true;
      state.onboardingComplete = action.payload.onboarding_complete ?? false;
      state.planSelected = action.payload.plan_selected ?? false;
    },
    clearCredentials(state) {
      state.user   = null;
      state.plan   = 'free';
      state.isAuthed = false;
      state.onboardingComplete = false;
      state.planSelected = false;
    },
    updatePlan(state, action) {
      state.plan = action.payload;
      state.planSelected = true;
    },
    setOnboardingComplete(state, action) {
      state.onboardingComplete = action.payload;
    },
    setPlanSelected(state, action) {
      state.planSelected = action.payload;
    },
    setUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  updatePlan,
  setOnboardingComplete,
  setPlanSelected,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser               = (s) => s.auth.user;
export const selectPlan               = (s) => s.auth.plan;
export const selectIsAuthed           = (s) => s.auth.isAuthed;
export const selectOnboardingComplete = (s) => s.auth.onboardingComplete;
export const selectPlanSelected       = (s) => s.auth.planSelected;
