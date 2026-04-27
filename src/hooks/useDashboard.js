import { useQuery } from '@tanstack/react-query';

// DEMO: static mock data — swap queryFn bodies for real API calls when backend is ready
const DEMO_SUMMARY = {
  total_interviews: 12,
  avg_score: 78,
  total_reports: 9,
  readiness: 82,
  welcome_text: 'Your interview readiness has improved. Keep practising to reach your goal!',
};

const DEMO_TREND = {
  scores: [
    { label: 'Jan 10', score: 62 },
    { label: 'Jan 15', score: 71 },
    { label: 'Jan 22', score: 68 },
    { label: 'Jan 28', score: 75 },
    { label: 'Feb 3',  score: 78 },
  ],
};

const DEMO_SKILLS = {
  categories: [
    { label: 'Data Structures', score: 85 },
    { label: 'System Design',   score: 72 },
    { label: 'Problem Solving', score: 79 },
    { label: 'Communication',   score: 88 },
    { label: 'JavaScript',      score: 91 },
  ],
};

const DEMO_INSIGHTS = {
  improvements:    'Work on explaining trade-offs in system design and improve time complexity analysis during interviews.',
  nextAction:      'Attempt a timed medium problem followed by a mock system design session this week.',
  hiringSnapshot:  'Demand for Frontend & Full Stack roles is up 18% this quarter. React and Node.js skills are trending.',
};

const DEMO_RECENT = {
  interviews: [
    {
      id: 'demo-r1',
      role: 'Frontend Developer',
      mode: 'mock',
      score: 78,
      duration: 1680,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-r2',
      role: 'Full Stack Engineer',
      mode: 'mock',
      score: 71,
      duration: 2100,
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: 'demo-r3',
      role: 'React Developer',
      mode: 'mock',
      score: 85,
      duration: 1320,
      completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
  ],
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => DEMO_SUMMARY,
    staleTime: Infinity,
  });
}

export function useDashboardTrend() {
  return useQuery({
    queryKey: ['dashboard', 'trend'],
    queryFn: async () => DEMO_TREND,
    staleTime: Infinity,
  });
}

export function useDashboardSkills() {
  return useQuery({
    queryKey: ['dashboard', 'skills'],
    queryFn: async () => DEMO_SKILLS,
    staleTime: Infinity,
  });
}

export function useDashboardInsights() {
  return useQuery({
    queryKey: ['dashboard', 'insights'],
    queryFn: async () => DEMO_INSIGHTS,
    staleTime: Infinity,
  });
}

export function useRecentInterviews() {
  return useQuery({
    queryKey: ['interviews', 'recent'],
    queryFn: async () => DEMO_RECENT,
    staleTime: Infinity,
  });
}
