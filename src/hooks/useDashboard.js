import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import { interviewApi } from '@/lib/api/interview';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary().then((r) => r.data),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useDashboardTrend() {
  return useQuery({
    queryKey: ['dashboard', 'trend'],
    queryFn: () => dashboardApi.getTrend().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useDashboardSkills() {
  return useQuery({
    queryKey: ['dashboard', 'skills'],
    queryFn: () => dashboardApi.getSkills().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardInsights() {
  return useQuery({
    queryKey: ['dashboard', 'insights'],
    queryFn: () => dashboardApi.getInsights().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentInterviews() {
  return useQuery({
    queryKey: ['interviews', 'recent'],
    queryFn: () => interviewApi.getRecent(3).then((r) => r.data),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
