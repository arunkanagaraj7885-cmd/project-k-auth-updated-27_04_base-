'use client';

const POPULAR_ROLES = [
  'Software Engineer', 'Data Analyst', 'Product Manager',
  'Business Analyst', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'DevOps Engineer',
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Target Role <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Software Engineer, Data Analyst…"
        className="input-base mb-3"
      />
      <div className="flex flex-wrap gap-2">
        {POPULAR_ROLES.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              value === role
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
