import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_DEMO_TASKS } from '../utils/demoData';

const STORAGE_KEY = 'taskflow_tasks_v1';
const INIT_FLAG_KEY = 'taskflow_supabase_initialized_v1';

export class LocalStorageAdapter {
  static load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.save(INITIAL_DEMO_TASKS);
        return INITIAL_DEMO_TASKS;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao ler do LocalStorage:', error);
      return INITIAL_DEMO_TASKS;
    }
  }

  static save(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar no LocalStorage:', error);
    }
  }

  static clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar LocalStorage:', error);
    }
  }
}

export function mapRowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category || 'PESSOAL',
    priority: row.priority || 'MEDIA',
    dueDate: row.due_date || '',
    completed: Boolean(row.completed),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapTaskToRow(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    category: task.category || 'PESSOAL',
    priority: task.priority || 'MEDIA',
    due_date: task.dueDate || null,
    completed: Boolean(task.completed),
    created_at: task.createdAt || new Date().toISOString(),
  };
}

export class SupabaseAdapter {
  static async load() {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase não configurado. Utilizando LocalStorage.');
      return LocalStorageAdapter.load();
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar do Supabase:', error);
        return LocalStorageAdapter.load();
      }

      // Se for a primeira inicialização e a tabela estiver vazia, popula com dados de demonstração
      const alreadyInitialized = localStorage.getItem(INIT_FLAG_KEY);
      if ((!data || data.length === 0) && !alreadyInitialized) {
        const localTasks = LocalStorageAdapter.load();
        const initialTasks = localTasks && localTasks.length > 0 ? localTasks : INITIAL_DEMO_TASKS;
        await this.saveAll(initialTasks);
        localStorage.setItem(INIT_FLAG_KEY, 'true');
        LocalStorageAdapter.save(initialTasks);
        return initialTasks;
      }

      const tasks = (data || []).map(mapRowToTask);
      LocalStorageAdapter.save(tasks);
      return tasks;
    } catch (err) {
      console.error('Exceção ao consultar Supabase:', err);
      return LocalStorageAdapter.load();
    }
  }

  static async saveAll(tasks) {
    if (!isSupabaseConfigured || !supabase || !tasks || tasks.length === 0) return;
    try {
      const rows = tasks.map(mapTaskToRow);
      const { error } = await supabase.from('tasks').upsert(rows);
      if (error) {
        console.error('Erro ao sincronizar tarefas no Supabase:', error);
      }
    } catch (err) {
      console.error('Exceção ao persistir lote no Supabase:', err);
    }
  }

  static async createTask(task) {
    if (!isSupabaseConfigured || !supabase) {
      const current = LocalStorageAdapter.load();
      LocalStorageAdapter.save([task, ...current]);
      return task;
    }

    const row = mapTaskToRow(task);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([row])
        .select();

      if (error) {
        console.error('Erro ao criar tarefa no Supabase:', error);
        return task;
      }

      if (data && data.length > 0) {
        return mapRowToTask(data[0]);
      }
      return task;
    } catch (err) {
      console.error('Exceção ao criar tarefa no Supabase:', err);
      return task;
    }
  }

  static async updateTask(taskId, updates) {
    if (!isSupabaseConfigured || !supabase) {
      const current = LocalStorageAdapter.load();
      const updated = current.map(t => (t.id === taskId ? { ...t, ...updates } : t));
      LocalStorageAdapter.save(updated);
      return updated.find(t => t.id === taskId);
    }

    const rowUpdates = {};
    if (updates.title !== undefined) rowUpdates.title = updates.title;
    if (updates.description !== undefined) rowUpdates.description = updates.description;
    if (updates.category !== undefined) rowUpdates.category = updates.category;
    if (updates.priority !== undefined) rowUpdates.priority = updates.priority;
    if (updates.dueDate !== undefined) rowUpdates.due_date = updates.dueDate || null;
    if (updates.completed !== undefined) rowUpdates.completed = updates.completed;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(rowUpdates)
        .eq('id', taskId)
        .select();

      if (error) {
        console.error('Erro ao atualizar tarefa no Supabase:', error);
        return null;
      }

      if (data && data.length > 0) {
        return mapRowToTask(data[0]);
      }
      return null;
    } catch (err) {
      console.error('Exceção ao atualizar tarefa no Supabase:', err);
      return null;
    }
  }

  static async deleteTask(taskId) {
    if (!isSupabaseConfigured || !supabase) {
      const current = LocalStorageAdapter.load();
      const updated = current.filter(t => t.id !== taskId);
      LocalStorageAdapter.save(updated);
      return true;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Erro ao deletar tarefa no Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Exceção ao deletar tarefa no Supabase:', err);
      return false;
    }
  }

  static async clear() {
    if (!isSupabaseConfigured || !supabase) {
      LocalStorageAdapter.clear();
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .neq('id', 'placeholder_guard');

      if (error) {
        console.error('Erro ao limpar tarefas no Supabase:', error);
      }
      LocalStorageAdapter.clear();
      localStorage.setItem(INIT_FLAG_KEY, 'true');
    } catch (err) {
      console.error('Exceção ao limpar tarefas no Supabase:', err);
      LocalStorageAdapter.clear();
    }
  }

  static async resetAllTasks() {
    if (!isSupabaseConfigured || !supabase) {
      LocalStorageAdapter.save(INITIAL_DEMO_TASKS);
      return INITIAL_DEMO_TASKS;
    }

    try {
      await supabase.from('tasks').delete().neq('id', 'placeholder_guard');
      await this.saveAll(INITIAL_DEMO_TASKS);
      LocalStorageAdapter.save(INITIAL_DEMO_TASKS);
      localStorage.setItem(INIT_FLAG_KEY, 'true');
      return INITIAL_DEMO_TASKS;
    } catch (err) {
      console.error('Exceção ao restaurar demo no Supabase:', err);
      LocalStorageAdapter.save(INITIAL_DEMO_TASKS);
      return INITIAL_DEMO_TASKS;
    }
  }

  static subscribe(onUpdate) {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const channel = supabase
        .channel('public:tasks')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          (payload) => {
            if (onUpdate) onUpdate(payload);
          }
        )
        .subscribe();

      return channel;
    } catch (err) {
      console.error('Erro ao iniciar subscrição realtime:', err);
      return null;
    }
  }

  static unsubscribe(channel) {
    if (channel && supabase) {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        console.error('Erro ao remover canal:', err);
      }
    }
  }
}

// O SupabaseAdapter agora é o armazenamento principal ativo
export const activeStorage = SupabaseAdapter;
