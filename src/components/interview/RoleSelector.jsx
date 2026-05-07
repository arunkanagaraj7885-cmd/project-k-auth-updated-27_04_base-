'use client';

const POPULAR_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Data Analyst',
  'HR Executive', 'Customer Support', 'Marketing Executive',
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-700">Target Role</label>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Pre-filled based on the resume</span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Frontend Developer"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-700">Popular Roles</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onChange(role)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                value === role
                  ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
