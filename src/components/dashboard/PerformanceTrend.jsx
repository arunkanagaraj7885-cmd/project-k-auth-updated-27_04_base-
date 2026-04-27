'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-sm">
      <p className="text-slate-500 text-xs mb-0.5">{label}</p>
      <p className="font-bold text-blue-600">{payload[0].value} / 100</p>
    </div>
  );
};

export default function PerformanceTrend({ data = [] }) {
  if (!data.length) {
    return (
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Performance Trend</h3>
        <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
          Complete your first interview to see trends.
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
