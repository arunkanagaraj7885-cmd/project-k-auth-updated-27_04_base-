import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports';

export function useReport(reportId) {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportsApi.getById(reportId).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!reportId,
  });
}

export function useReports(params) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportsApi.getAll(params).then((r) => r.data),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useScoreCard(id) {
  return useQuery({
    queryKey: ['score-card', id],
    queryFn: () => reportsApi.getScoreCard(id).then((r) => r.data),
    staleTime: 60 * 60 * 1000,
    enabled: !!id,
  });
}
