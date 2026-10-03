import React from 'react';
import { CATEGORIES, PRIORITIES } from '../../types/taskConstants';
import { isOverdue } from '../../utils/dateUtils';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Target, Award, PieChart } from 'lucide-react';

export function AnalyticsView({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.completed));
  const overdueCount = overdueTasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Distribuição por categoria
  const categoryStats = Object.values(CATEGORIES).map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat.id);
    const catCompleted = catTasks.filter((t) => t.completed).length;
    const catTotal = catTasks.length;
    const catRate = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
    return {
      ...cat,
      total: catTotal,
      completed: catCompleted,
      rate: catRate,
      percentageOfTotal: total > 0 ? Math.round((catTotal / total) * 100) : 0,
    };
  });

  // Distribuição por prioridade
  const priorityStats = Object.values(PRIORITIES).map((prio) => {
    const prioTasks = tasks.filter((t) => t.priority === prio.id);
    const prioCompleted = prioTasks.filter((t) => t.completed).length;
    const prioTotal = prioTasks.length;
    const prioRate = prioTotal > 0 ? Math.round((prioCompleted / prioTotal) * 100) : 0;
    return {
      ...prio,
      total: prioTotal,
      completed: prioCompleted,
      rate: prioRate,
      percentageOfTotal: total > 0 ? Math.round((prioTotal / total) * 100) : 0,
    };
  });

  // Tarefas de alta prioridade pendentes
  const highPriorityPending = tasks.filter((t) => t.priority === 'ALTA' && !t.completed);

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho da Visão */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Dashboard de Produtividade & Análises
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visão detalhada sobre seu progresso, distribuição de tarefas e metas.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50/80 border border-indigo-100 px-4 py-2 rounded-xl">
          <Award className="w-6 h-6 text-indigo-600" />
          <div>
            <span className="text-xs font-semibold text-indigo-900 block">Eficiência Geral</span>
            <span className="text-lg font-bold text-indigo-700">{completionRate}% Concluído</span>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Geral</span>
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-extrabold text-slate-800">{total}</span>
          <p className="text-xs text-slate-400 mt-1">Tarefas cadastradas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-600">{completed}</span>
          <p className="text-xs text-slate-400 mt-1">Objetivos alcançados</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Pendentes</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-extrabold text-amber-600">{pending}</span>
          <p className="text-xs text-slate-400 mt-1">Em andamento</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Atrasadas</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-3xl font-extrabold text-rose-600">{overdueCount}</span>
          <p className="text-xs text-slate-400 mt-1">Demandam atenção</p>
        </div>

      </div>

      {/* Grid de Gráficos e Distribuições */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribuição por Categoria */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Distribuição por Categoria</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">{categoryStats.length} Categorias</span>
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cat.dotColor}`} />
                    <span className="font-medium text-slate-700">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="font-semibold text-slate-700">{cat.completed}/{cat.total}</span>
                    <span className="text-xs text-slate-400">({cat.rate}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.id === 'TRABALHO'
                        ? 'bg-blue-500'
                        : cat.id === 'PESSOAL'
                        ? 'bg-emerald-500'
                        : cat.id === 'ESTUDOS'
                        ? 'bg-amber-500'
                        : 'bg-teal-500'
                    }`}
                    style={{ width: `${cat.total > 0 ? (cat.completed / cat.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuição por Prioridade */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Status por Prioridade</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Níveis de Urgência</span>
          </div>

          <div className="space-y-5">
            {priorityStats.map((prio) => (
              <div key={prio.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${prio.dotColor}`} />
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm">Prioridade {prio.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {prio.completed} de {prio.total} feitas
                  </span>
                </div>

                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      prio.id === 'ALTA'
                        ? 'bg-rose-500'
                        : prio.id === 'MEDIA'
                        ? 'bg-amber-500'
                        : 'bg-slate-500'
                    }`}
                    style={{ width: `${prio.total > 0 ? (prio.completed / prio.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Card de Foco: Tarefas Prioritárias Pendentes */}
      {highPriorityPending.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 shadow-soft-sm">
          <div className="flex items-center gap-2 text-rose-800 font-semibold mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Atenção: {highPriorityPending.length} tarefa(s) de Alta Prioridade requerem sua ação</span>
          </div>
          <div className="space-y-2">
            {highPriorityPending.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded-xl border border-rose-100 flex items-center justify-between text-xs sm:text-sm"
              >
                <span className="font-medium text-slate-800 truncate mr-3">{item.title}</span>
                <span className="text-rose-600 font-semibold flex-shrink-0 text-xs">
                  Prazo: {item.dueDate || 'Não definido'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
