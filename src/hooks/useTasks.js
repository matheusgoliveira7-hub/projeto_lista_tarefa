import { useState, useEffect, useMemo, useCallback } from 'react';
import { TaskService } from '../services/taskService';
import { STATUS_FILTERS, PRIORITIES } from '../types/taskConstants';
import confetti from 'canvas-confetti';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.TODAS);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'createdAt'
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Carrega as tarefas inicialmente e configura sincronização em tempo real
  useEffect(() => {
    let isMounted = true;

    async function loadInitialTasks() {
      setIsLoading(true);
      try {
        const loaded = await TaskService.getTasks();
        if (isMounted) {
          setTasks(loaded || []);
        }
      } catch (error) {
        console.error('Erro ao inicializar tarefas:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialTasks();

    // Inscrição em tempo real (Supabase Realtime)
    const channel = TaskService.subscribeToChanges(async () => {
      try {
        const freshTasks = await TaskService.getTasks();
        if (isMounted && freshTasks) {
          setTasks(freshTasks);
        }
      } catch (err) {
        console.error('Erro ao atualizar tarefas via Realtime:', err);
      }
    });

    return () => {
      isMounted = false;
      TaskService.unsubscribe(channel);
    };
  }, []);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899']
      });
    } catch (e) {
      // Ignora caso canvas não esteja disponível
    }
  }, []);

  const addTask = useCallback(async (taskData) => {
    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      category: taskData.category || 'PESSOAL',
      priority: taskData.priority || 'MEDIA',
      dueDate: taskData.dueDate || '',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Atualização otimista na interface
    setTasks(prev => [newTask, ...prev]);
    setIsSyncing(true);

    try {
      const created = await TaskService.createTask(newTask);
      if (created && created.id !== newTask.id) {
        setTasks(prev => prev.map(t => (t.id === newTask.id ? created : t)));
      }
    } catch (error) {
      console.error('Erro ao salvar tarefa no Supabase:', error);
    } finally {
      setIsSyncing(false);
    }

    return newTask;
  }, []);

  const editTask = useCallback(async (taskId, updates) => {
    // Atualização otimista
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, ...updates } : t)));
    setIsSyncing(true);

    try {
      await TaskService.updateTask(taskId, updates);
    } catch (error) {
      console.error('Erro ao editar tarefa no Supabase:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const removeTask = useCallback(async (taskId) => {
    // Atualização otimista
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setIsSyncing(true);

    try {
      await TaskService.deleteTask(taskId);
    } catch (error) {
      console.error('Erro ao remover tarefa no Supabase:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const toggleTask = useCallback(async (taskId) => {
    let isNowCompleted = false;

    // Atualização otimista
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          isNowCompleted = !t.completed;
          return { ...t, completed: isNowCompleted };
        }
        return t;
      })
    );

    if (isNowCompleted) {
      triggerCelebration();
    }

    setIsSyncing(true);
    try {
      await TaskService.toggleComplete(taskId, isNowCompleted);
    } catch (error) {
      console.error('Erro ao alternar status da tarefa no Supabase:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [triggerCelebration]);

  const resetToDemo = useCallback(async () => {
    setIsLoading(true);
    try {
      const resetList = await TaskService.resetAllTasks();
      setTasks(resetList);
    } catch (error) {
      console.error('Erro ao restaurar tarefas de demonstração:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtros combinados e ordenação
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filtro de status
      if (statusFilter === STATUS_FILTERS.PENDENTES && task.completed) return false;
      if (statusFilter === STATUS_FILTERS.CONCLUIDAS && !task.completed) return false;

      // Filtro de categoria
      if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;

      // Filtro de prioridade
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;

      // Filtro de busca textual
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      // Tarefas pendentes primeiro, concluídas no fim
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortBy === 'priority') {
        const weightA = PRIORITIES[a.priority]?.weight || 0;
        const weightB = PRIORITIES[b.priority]?.weight || 0;
        return weightB - weightA;
      }

      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }

      // Default: createdAt desc
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, statusFilter, categoryFilter, priorityFilter, searchQuery, sortBy]);

  // Contadores para métricas
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionRate,
    };
  }, [tasks]);

  return {
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
  };
}
