import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { NAVIGATION_TABS } from './types/taskConstants';
import { Navbar } from './components/layout/Navbar';
import { ConfirmDialog } from './components/layout/ConfirmDialog';
import { TaskStatsSummary } from './components/tasks/TaskStatsSummary';
import { TaskFilter } from './components/tasks/TaskFilter';
import { TaskList } from './components/tasks/TaskList';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CalendarView } from './components/calendar/CalendarView';
import { Database, Plus, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from './components/common/Button';

export function App() {
  const {
    tasks,
    filteredTasks,
    stats,
    isLoading,
    isSyncing,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    addTask,
    editTask,
    removeTask,
    toggleTask,
    resetToDemo,
  } = useTasks();

  const [activeTab, setActiveTab] = useState(NAVIGATION_TABS.TAREFAS);

  // Estados dos modais
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [prefilledDueDate, setPrefilledDueDate] = useState('');

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Abertura de modal de nova tarefa
  const handleOpenNewTaskModal = (initialDate = '') => {
    setEditingTask(null);
    setPrefilledDueDate(initialDate || '');
    setIsTaskModalOpen(true);
  };

  // Abertura de modal de edição
  const handleOpenEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Salvar criação ou edição
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask({
        ...taskData,
        dueDate: taskData.dueDate || prefilledDueDate,
      });
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // Exclusão confirmada
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      removeTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  // Logout / Reset
  const handleConfirmLogout = () => {
    resetToDemo();
    setActiveTab(NAVIGATION_TABS.TAREFAS);
    setIsLogoutModalOpen(false);
  };

  const hasActiveFilters =
    statusFilter !== 'TODAS' ||
    categoryFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    Boolean(searchQuery.trim());

  const handleClearFilters = () => {
    setStatusFilter('TODAS');
    setCategoryFilter('ALL');
    setPriorityFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Navbar com abas Tarefas, Análises, Calendário e Sair */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewTaskModal={() => handleOpenNewTaskModal()}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
        stats={stats}
        isSyncing={isSyncing}
      />

      {/* 2. Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Visualização de Tarefas */}
        {activeTab === NAVIGATION_TABS.TAREFAS && (
          <div className="animate-in fade-in duration-200">
            {/* Header com botão de ação rápida no mobile */}
            <div className="flex sm:hidden items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Minhas Tarefas</h1>
                <p className="text-xs text-slate-500">Organize sua rotina no Supabase</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => handleOpenNewTaskModal()}
              >
                Nova
              </Button>
            </div>

            {/* Sumário de métricas rápidas */}
            <TaskStatsSummary stats={stats} />

            {/* Barra de Filtros e Busca */}
            <TaskFilter
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              stats={stats}
            />

            {/* Lista Principal de Tarefas */}
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              onToggle={toggleTask}
              onEdit={handleOpenEditTaskModal}
              onDelete={setTaskToDelete}
              onOpenNewTaskModal={() => handleOpenNewTaskModal()}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Visualização de Análises */}
        {activeTab === NAVIGATION_TABS.ANALISES && (
          <div className="animate-in fade-in duration-200">
            <AnalyticsView tasks={tasks} />
          </div>
        )}

        {/* Visualização de Calendário */}
        {activeTab === NAVIGATION_TABS.CALENDARIO && (
          <div className="animate-in fade-in duration-200">
            <CalendarView
              tasks={tasks}
              onToggleTask={toggleTask}
              onOpenNewTaskModalWithDate={handleOpenNewTaskModal}
            />
          </div>
        )}

      </main>

      {/* 3. Rodapé Informativo */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">TaskFlow Pro</span>
            <span>—</span>
            <span>Produtividade conectada com Supabase</span>
          </div>

          <div className="flex items-center gap-3">
            {isSyncing ? (
              <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/70 text-xs font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Sincronizando com Supabase...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase: <strong>lista-tarefas</strong></span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/70">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Realtime Ativo</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. Modal de Criação / Edição de Tarefas */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialData={
          editingTask ||
          (prefilledDueDate ? { dueDate: prefilledDueDate, category: 'TRABALHO', priority: 'MEDIA' } : null)
        }
      />

      {/* 5. Diálogo de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Tarefa"
        message={
          taskToDelete
            ? `Tem certeza que deseja excluir a tarefa "${taskToDelete.title}"? Esta ação removerá a tarefa definitivamente do Supabase.`
            : ''
        }
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* 6. Diálogo de Confirmação de Sair / Reset */}
      <ConfirmDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Restaurar Dados Padrão"
        message="Deseja restaurar as tarefas de demonstração no Supabase? As tarefas atuais serão substituídas pelas tarefas modelo."
        confirmText="Sim, restaurar"
        cancelText="Cancelar"
        variant="amber"
      />

    </div>
  );
}
export default App;
