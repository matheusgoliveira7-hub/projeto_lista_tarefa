import React from 'react';
import { Check } from 'lucide-react';

export function Checkbox({
  checked = false,
  onChange,
  id,
  label,
  className = '',
}) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 border ${
            checked
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-300 group-hover:border-indigo-400 group-hover:bg-slate-50'
          }`}
        >
          <Check
            className={`w-3.5 h-3.5 stroke-[3] transition-transform duration-200 ${
              checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          />
        </div>
      </div>
      {label && (
        <span
          className={`text-sm transition-colors ${
            checked ? 'line-through text-slate-400' : 'text-slate-700'
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
}
