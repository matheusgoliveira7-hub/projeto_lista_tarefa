import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, CheckCircle, Clock } from 'lucide-react';
import { getCalendarGrid, getTodayISODate } from '../../utils/dateUtils';
import { CATEGORIES } from '../../types/taskConstants';
import { Button } from '../common/Button';

export function CalendarView({
  tasks,
  onToggleTask,
  onOpenNewTaskModalWithDate,
}) {
  const todayISO = getTodayISODate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayISO, setSelectedDayISO] = useState(todayISO);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const daysGrid = getCalendarGrid(currentYear, currentMonth);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDayISO(todayISO);
  };

  // Mapear tarefas por data ISO
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    if (!acc[task.dueDate]) {
      acc[task.dueDate] = [];
    }
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  const selectedDayTasks = tasksByDate[selectedDayISO] || [];

  return (
    <div className="space-y-6">
      
      {/* Controles de Navegação do Calendário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 capitalize">{capitalizedMonth}</h2>
            <p className="text-xs text-slate-400">Navegue pelas datas de vencimento de suas atividades</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleToday}>
            Hoje
          </Button>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={handlePrevMonth}
              title="Mês anterior"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              title="Próximo mês"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grade do Calendário (2 colunas no desktop) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm">
          
          {/* Cabeçalho dos Dias da Semana */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, idx) => (
              <div key={idx} className="py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Células dos Dias */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysGrid.map((dayObj, idx) => {
              const dayTasks = tasksByDate[dayObj.dateStr] || [];
              const isToday = dayObj.dateStr === todayISO;
              const isSelected = dayObj.dateStr === selectedDayISO;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayISO(dayObj.dateStr)}
                  className={`min-h-[75px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                      : isToday
                      ? 'border-indigo-200 bg-indigo-50/15'
                      : dayObj.isCurrentMonth
                      ? 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      : 'border-transparent bg-slate-50/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg ${
                        isToday
                          ? 'bg-indigo-600 text-white shadow-soft-sm'
                          : dayObj.isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-300'
                      }`}
                    >
                      {dayObj.dayNumber}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Badges de tarefas no dia */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => {
                      const cat = CATEGORIES[t.category] || CATEGORIES.PESSOAL;
                      return (
                        <div
                          key={t.id}
                          className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium border ${
                            t.completed
                              ? 'line-through bg-slate-100 text-slate-400 border-slate-200'
                              : cat.color
                          }`}
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-semibold block text-center">
                        +{dayTasks.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Detalhes do Dia Selecionado (1 coluna no desktop) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                  Data Selecionada
                </span>
                <h3 className="font-bold text-slate-800 text-base">
                  {selectedDayISO
                    ? new Date(
                        ...selectedDayISO.split('-').map((v, i) => (i === 1 ? Number(v) - 1 : Number(v)))
                      ).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'long' })
                    : 'Nenhuma data'}
                </h3>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => onOpenNewTaskModalWithDate(selectedDayISO)}
              >
                Adicionar
              </Button>
            </div>

            {/* Lista de Tarefas do dia selecionado */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {selectedDayTasks.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Nenhuma tarefa agendada</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Aproveite o dia livre ou agende uma nova atividade.
                  </p>
                </div>
              ) : (
                selectedDayTasks.map((task) => {
                  const cat = CATEGORIES[task.category] || CATEGORIES.PESSOAL;
                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-soft-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${cat.badgeClass}`}>
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Prioridade {task.priority}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            task.completed ? 'text-emerald-500' : 'text-slate-300'
                          }`}
                        />
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            Clique na tarefa para alternar seu status de conclusão.
          </div>
        </div>

      </div>

    </div>
  );
}
