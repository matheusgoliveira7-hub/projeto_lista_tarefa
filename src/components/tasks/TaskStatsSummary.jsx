import React from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

export function TaskStatsSummary({ stats }) {
  const cards = [
    {
      title: 'Total de Tarefas',
      value: stats.total,
      icon: ListTodo,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Concluídas',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Conclusão',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
      showProgress: true,
      progress: stats.completionRate,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{card.title}</span>
              <div className={`p-2 rounded-xl border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</span>
            </div>

            {card.showProgress && (
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-violet-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
