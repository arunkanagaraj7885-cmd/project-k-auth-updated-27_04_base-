import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/reports';

export function useReports(params = {}) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: async () => {
      const { page = 1, search = '', type = '', scoreRange = '', dateRange = '' } = params;

      const queryParams = { page };
      if (search)     queryParams.search      = search;
      if (type)       queryParams.type        = type;
      if (scoreRange) queryParams.score_range = scoreRange;
      if (dateRange)  queryParams.date        = dateRange;

      const { data } = await reportsApi.getLivekit(queryParams);

      const { kpi, items, total, page_size } = data;

      return {
        reports:       items,
        total,
        total_pages:   Math.ceil(total / page_size),
        avg_score:     kpi.avg_score,
        highest_score: kpi.highest_score,
      };
    },
    staleTime: 30_000,
  });
}

export function useReport(sessionId) {
  return useQuery({
    queryKey: ['report', sessionId],
    queryFn: async () => {
      const { data } = await reportsApi.getLivekitReport(sessionId);
      return data;
    },
    staleTime: 30_000,
    enabled: !!sessionId,
  });
}

