import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { STATUS_FILTERS, CATEGORIES, PRIORITIES } from '../../types/taskConstants';

export function TaskFilter({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  stats,
}) {
  const statusTabs = [
    { id: STATUS_FILTERS.TODAS, label: 'Todas', count: stats.total },
    { id: STATUS_FILTERS.PENDENTES, label: 'Pendentes', count: stats.pending },
    { id: STATUS_FILTERS.CONCLUIDAS, label: 'Concluídas', count: stats.completed },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-soft-sm mb-6 space-y-4">
      {/* Linha Superior: Filtros de Status & Busca */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Botões de Filtro de Status ('Todas', 'Pendentes', 'Concluídas') */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 self-start md:self-auto w-full md:w-auto">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-soft-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Input de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Linha Inferior: Filtros de Categoria, Prioridade e Ordenação */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 font-medium text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrar:
          </span>

          {/* Seletor de Categoria */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">Todas as Categorias</option>
            {Object.values(CATEGORIES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Seletor de Prioridade */}
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">Todas as Prioridades</option>
            {Object.values(PRIORITIES).map((prio) => (
              <option key={prio.id} value={prio.id}>
                Prioridade {prio.label}
              </option>
            ))}
          </select>

          {/* Botão de limpar filtros caso algum esteja ativo */}
          {(categoryFilter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                onCategoryChange('ALL');
                onPriorityChange('ALL');
                onSearchChange('');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium text-xs">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="dueDate">Data de Vencimento</option>
            <option value="priority">Prioridade (Maior primeiro)</option>
            <option value="createdAt">Criada mais recentemente</option>
          </select>
        </div>

      </div>
    </div>
  );
}
