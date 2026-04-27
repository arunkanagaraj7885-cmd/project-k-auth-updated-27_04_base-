import { useQuery } from '@tanstack/react-query';

// DEMO: static mock data
const DEMO_REPORTS = [
  { id: 'r1',  role: 'Frontend Developer Interview',   mode: 'full', score: 82, completedAt: '2026-04-21T10:00:00Z', status: 'completed' },
  { id: 'r2',  role: 'HR Screening Mock',              mode: 'mock', score: 76, completedAt: '2026-04-18T10:00:00Z', status: 'completed' },
  { id: 'r3',  role: 'Business Analyst Interview',     mode: 'full', score: 88, completedAt: '2026-04-15T10:00:00Z', status: 'completed' },
  { id: 'r4',  role: 'QA Engineer Mock',               mode: 'mock', score: 71, completedAt: '2026-04-12T10:00:00Z', status: 'completed' },
  { id: 'r5',  role: 'React Developer Interview',      mode: 'full', score: 84, completedAt: '2026-04-08T10:00:00Z', status: 'completed' },
  { id: 'r6',  role: 'Support Executive Mock',         mode: 'mock', score: 68, completedAt: '2026-04-05T10:00:00Z', status: 'completed' },
  { id: 'r7',  role: 'Data Analyst Interview',         mode: 'full', score: 79, completedAt: '2026-03-31T10:00:00Z', status: 'completed' },
  { id: 'r8',  role: 'Operations Associate Mock',      mode: 'mock', score: 74, completedAt: '2026-03-26T10:00:00Z', status: 'completed' },
  { id: 'r9',  role: 'Junior Developer Interview',     mode: 'full', score: 92, completedAt: '2026-03-22T10:00:00Z', status: 'completed' },
  { id: 'r10', role: 'Product Manager Mock',           mode: 'mock', score: 83, completedAt: '2026-03-18T10:00:00Z', status: 'completed' },
  { id: 'r11', role: 'Backend Developer Interview',    mode: 'full', score: 77, completedAt: '2026-03-14T10:00:00Z', status: 'completed' },
  { id: 'r12', role: 'UX Designer Mock',               mode: 'mock', score: 65, completedAt: '2026-03-10T10:00:00Z', status: 'completed' },
  { id: 'r13', role: 'Node.js Developer Interview',    mode: 'full', score: 86, completedAt: '2026-03-06T10:00:00Z', status: 'completed' },
  { id: 'r14', role: 'Sales Associate Mock',           mode: 'mock', score: 72, completedAt: '2026-03-02T10:00:00Z', status: 'completed' },
  { id: 'r15', role: 'System Design Interview',        mode: 'full', score: 78, completedAt: '2026-02-27T10:00:00Z', status: 'completed' },
  { id: 'r16', role: 'DevOps Engineer Mock',           mode: 'mock', score: 69, completedAt: '2026-02-23T10:00:00Z', status: 'completed' },
  { id: 'r17', role: 'Python Developer Interview',     mode: 'full', score: 91, completedAt: '2026-02-19T10:00:00Z', status: 'completed' },
  { id: 'r18', role: 'Marketing Manager Mock',         mode: 'mock', score: 73, completedAt: '2026-02-15T10:00:00Z', status: 'completed' },
  { id: 'r19', role: 'Full Stack Developer Interview', mode: 'full', score: 87, completedAt: '2026-02-11T10:00:00Z', status: 'completed' },
  { id: 'r20', role: 'Customer Service Mock',          mode: 'mock', score: 66, completedAt: '2026-02-07T10:00:00Z', status: 'completed' },
  { id: 'r21', role: 'iOS Developer Interview',        mode: 'full', score: 80, completedAt: '2026-02-03T10:00:00Z', status: 'completed' },
  { id: 'r22', role: 'Scrum Master Mock',              mode: 'mock', score: 75, completedAt: '2026-01-30T10:00:00Z', status: 'completed' },
  { id: 'r23', role: 'Android Developer Interview',    mode: 'full', score: 85, completedAt: '2026-01-26T10:00:00Z', status: 'completed' },
  { id: 'r24', role: 'HR Generalist Mock',             mode: 'mock', score: 70, completedAt: '2026-01-22T10:00:00Z', status: 'completed' },
  { id: 'r25', role: 'Machine Learning Interview',     mode: 'full', score: 89, completedAt: '2026-01-18T10:00:00Z', status: 'completed' },
  { id: 'r26', role: 'Technical Support Mock',         mode: 'mock', score: 63, completedAt: '2026-01-14T10:00:00Z', status: 'completed' },
];

export function useReports(params = {}) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: async () => {
      const { page = 1, limit = 10, search = '', type = '', scoreRange = '', dateRange = '' } = params;

      let filtered = [...DEMO_REPORTS];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((r) => r.role.toLowerCase().includes(q));
      }
      if (type === 'full') filtered = filtered.filter((r) => r.mode === 'full');
      if (type === 'mock') filtered = filtered.filter((r) => r.mode === 'mock');

      if (scoreRange === '90-100') filtered = filtered.filter((r) => r.score >= 90);
      else if (scoreRange === '80-89') filtered = filtered.filter((r) => r.score >= 80 && r.score <= 89);
      else if (scoreRange === '70-79') filtered = filtered.filter((r) => r.score >= 70 && r.score <= 79);
      else if (scoreRange === '60-69') filtered = filtered.filter((r) => r.score >= 60 && r.score <= 69);
      else if (scoreRange === 'below60') filtered = filtered.filter((r) => r.score < 60);

      if (dateRange) {
        const now = new Date();
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const cutoff = new Date(now - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((r) => new Date(r.completedAt) >= cutoff);
      }

      const total = filtered.length;
      const avgScore = total ? Math.round(filtered.reduce((s, r) => s + r.score, 0) / total) : 0;
      const highestScore = total ? Math.max(...filtered.map((r) => r.score)) : 0;

      const start = (page - 1) * limit;
      const reports = filtered.slice(start, start + limit);

      return { reports, total, total_pages: Math.ceil(total / limit), avg_score: avgScore, highest_score: highestScore };
    },
    staleTime: Infinity,
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
    queryFn: async () => ({ id, verified: true }),
    staleTime: Infinity,
    enabled: !!id,
  });
}
