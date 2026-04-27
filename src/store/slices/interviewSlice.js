import { createSlice } from '@reduxjs/toolkit';

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    config: null,
    sessionId: null,
    liveInsights: [],
    transcript: [],
  },
  reducers: {
    setConfig(s, a)     { s.config = a.payload; },
    setSessionId(s, a)  { s.sessionId = a.payload; },
    addInsight(s, a)    { s.liveInsights.push(a.payload); },
    addMessage(s, a)    { s.transcript.push(a.payload); },
    resetSession(s)     {
      s.sessionId = null;
      s.liveInsights = [];
      s.transcript = [];
    },
  },
});

export const { setConfig, setSessionId, addInsight, addMessage, resetSession } = interviewSlice.actions;
export default interviewSlice.reducer;

export const selectConfig      = (s) => s.interview.config;
export const selectSessionId   = (s) => s.interview.sessionId;
export const selectLiveInsights = (s) => s.interview.liveInsights;
export const selectTranscript  = (s) => s.interview.transcript;
