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

export function useReport(reportId) {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: async () => {
      const report = DEMO_REPORTS.find((r) => r.id === reportId);
      if (!report) return null;
      return {
        ...report,
        feedback: 'Strong communication and structured thinking throughout the interview.',
        strengths: ['Clear problem explanation', 'Good use of examples', 'Confident delivery'],
        improvements: ['Work on time complexity analysis', 'Deepen system design knowledge'],
      };
    },
    staleTime: Infinity,
    enabled: !!reportId,
  });
}

export function useScoreCard(id) {
  return useQuery({
    queryKey: ['score-card', id],
    queryFn: async () => {
      const report = DEMO_REPORTS.find((r) => r.id === id) ?? DEMO_REPORTS[0];
      const s = report.score;

      const readinessLabel =
        s >= 85 ? 'Excellent Interview Readiness' :
        s >= 75 ? 'Strong Interview Readiness'    :
        s >= 65 ? 'Good Interview Readiness'      : 'Developing Interview Readiness';

      const readinessDesc =
        s >= 75
          ? 'Clear communication, good structure, and steady confidence across the interview.'
          : 'Shows solid potential with specific areas to develop further before the next round.';

      const recommendation      = s >= 80 ? 'Shortlist' : s >= 70 ? 'Consider' : 'Review';
      const recommendationLabel = s >= 80 ? 'Good fit for next round' : s >= 70 ? 'Needs one more round' : 'Below threshold';

      return {
        id,
        verified: true,
        candidate_name: 'Aarav Kumar',
        initials: 'AK',
        role: report.role,
        mode: report.mode,
        completed_at: report.completedAt,
        score: s,
        readiness_label: readinessLabel,
        readiness_desc: readinessDesc,
        snapshot: {
          communication:        parseFloat((s / 10).toFixed(1)),
          communication_label:  'Clear and easy to follow',
          confidence:           parseFloat(((s - 1) / 10).toFixed(1)),
          confidence_label:     'Steady and composed',
          recommendation,
          recommendation_label: recommendationLabel,
        },
        core_scores: [
          { label: 'Communication',       value: parseFloat((s / 10).toFixed(1)) },
          { label: 'Confidence',          value: parseFloat(((s - 1) / 10).toFixed(1)) },
          { label: 'Problem Solving',     value: parseFloat(((s - 6) / 10).toFixed(1)) },
          { label: 'Behavioral Readiness', value: parseFloat(((s - 3) / 10).toFixed(1)) },
        ],
        key_summary: [
          { type: 'positive',    text: 'Answered with good clarity and kept responses structured.' },
          { type: 'positive',    text: 'Maintained steady tone and confidence throughout the interview.' },
          { type: 'improvement', text: 'Can improve depth in problem-solving examples during technical questions.' },
        ],
      };
    },
    staleTime: Infinity,
    enabled: !!id,
  });
}
