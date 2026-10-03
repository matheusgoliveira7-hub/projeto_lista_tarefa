import React from 'react';
import { Calendar, Trash2, Edit3, AlertCircle } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../../types/taskConstants';
import { formatFriendlyDate, isOverdue } from '../../utils/dateUtils';
import { Checkbox } from '../common/Checkbox';
import { Badge } from '../common/Badge';

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  const categoryConfig = CATEGORIES[task.category] || CATEGORIES.PESSOAL;
  const priorityConfig = PRIORITIES[task.priority] || PRIORITIES.MEDIA;

  const overdue = isOverdue(task.dueDate, task.completed);
  const formattedDate = formatFriendlyDate(task.dueDate);

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 opacity-65'
          : 'border-slate-200/90 hover:border-slate-300 shadow-soft-sm hover:shadow-soft-md'
      }`}
    >
      {/* 1. Checkbox customizado no lado esquerdo */}
      <div className="pt-0.5 flex-shrink-0">
        <Checkbox
          id={`check-${task.id}`}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 min-w-0">
        
        {/* Linha com Tags: Categoria e Prioridade */}
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {/* Tag de Categoria */}
          <Badge
            className={categoryConfig.badgeClass}
            dotColor={categoryConfig.dotColor}
            size="sm"
          >
            {categoryConfig.label}
          </Badge>

          {/* Tag de Prioridade */}
          <Badge
            className={priorityConfig.badgeClass}
            dotColor={priorityConfig.dotColor}
            size="sm"
          >
            {priorityConfig.label}
          </Badge>

          {/* Indicador de Atraso */}
          {overdue && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
              <AlertCircle className="w-3 h-3" />
              Atrasada
            </span>
          )}
        </div>

        {/* Título da tarefa em destaque */}
        <h4
          onClick={() => onToggle(task.id)}
          className={`text-sm sm:text-base font-semibold leading-snug cursor-pointer select-none transition-colors ${
            task.completed
              ? 'line-through text-slate-400'
              : 'text-slate-800 hover:text-indigo-600'
          }`}
        >
          {task.title}
        </h4>

        {/* Descrição se houver */}
        {task.description && (
          <p
            className={`mt-1 text-xs sm:text-sm line-clamp-2 leading-relaxed ${
              task.completed ? 'text-slate-400 line-through' : 'text-slate-500'
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Data de vencimento com ícone de calendário */}
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div
            className={`inline-flex items-center gap-1.5 font-medium ${
              overdue
                ? 'text-rose-600 font-semibold'
                : task.completed
                ? 'text-slate-400'
                : 'text-slate-500'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${overdue ? 'text-rose-500' : 'text-slate-400'}`} />
            <span>Prazo: {formattedDate}</span>
          </div>
        </div>

      </div>

      {/* Ações no canto direito: Editar e Lixeira (Trash) */}
      <div className="flex items-center gap-1 sm:opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(task)}
          title="Editar tarefa"
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(task)}
          title="Excluir tarefa"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
