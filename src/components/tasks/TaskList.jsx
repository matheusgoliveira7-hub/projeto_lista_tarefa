import React from 'react';
import { TaskItem } from './TaskItem';
import { CheckCircle2, Inbox, Plus, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

export function TaskList({
  tasks,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
  onOpenNewTaskModal,
  hasActiveFilters,
  onClearFilters,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft-sm animate-pulse flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 flex-1">
              <div className="w-5 h-5 rounded-lg bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-slate-100 rounded-full" />
              <div className="w-16 h-6 bg-slate-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-soft-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
          {hasActiveFilters ? <Inbox className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          {hasActiveFilters ? 'Nenhuma tarefa encontrada' : 'Tudo limpo por aqui!'}
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          {hasActiveFilters
            ? 'Não há tarefas correspondentes aos filtros selecionados. Tente alterar os critérios de busca.'
            : 'Você concluiu todas as suas tarefas ou ainda não cadastrou nenhuma. Que tal criar uma agora?'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {hasActiveFilters ? (
            <Button variant="secondary" onClick={onClearFilters}>
              Limpar Filtros
            </Button>
          ) : (
            <Button variant="primary" icon={Plus} onClick={onOpenNewTaskModal}>
              Criar Nova Tarefa
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
