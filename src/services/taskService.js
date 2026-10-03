import { activeStorage } from './storageAdapter';

export const TaskService = {
  async getTasks() {
    return await activeStorage.load();
  },

  async createTask(newTaskData) {
    const newTask = {
      id: newTaskData.id || 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: newTaskData.title.trim(),
      description: newTaskData.description ? newTaskData.description.trim() : '',
      category: newTaskData.category || 'PESSOAL',
      priority: newTaskData.priority || 'MEDIA',
      dueDate: newTaskData.dueDate || '',
      completed: Boolean(newTaskData.completed),
      createdAt: newTaskData.createdAt || new Date().toISOString(),
    };

    if (activeStorage.createTask) {
      return await activeStorage.createTask(newTask);
    }

    const tasks = await activeStorage.load();
    const updated = [newTask, ...tasks];
    activeStorage.save(updated);
    return newTask;
  },

  async updateTask(taskId, updates) {
    if (activeStorage.updateTask) {
      return await activeStorage.updateTask(taskId, updates);
    }

    const tasks = await activeStorage.load();
    const updated = tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t));
    activeStorage.save(updated);
    return updated.find(t => t.id === taskId);
  },

  async deleteTask(taskId) {
    if (activeStorage.deleteTask) {
      return await activeStorage.deleteTask(taskId);
    }

    const tasks = await activeStorage.load();
    const updated = tasks.filter(t => t.id !== taskId);
    activeStorage.save(updated);
    return true;
  },

  async toggleComplete(taskId, isNowCompleted) {
    if (activeStorage.updateTask) {
      const updated = await activeStorage.updateTask(taskId, { completed: isNowCompleted });
      return { task: updated, isNowCompleted };
    }

    const tasks = await activeStorage.load();
    const updated = tasks.map(t => (t.id === taskId ? { ...t, completed: isNowCompleted } : t));
    activeStorage.save(updated);
    return { task: updated.find(t => t.id === taskId), isNowCompleted };
  },

  async resetAllTasks() {
    if (activeStorage.resetAllTasks) {
      return await activeStorage.resetAllTasks();
    }
    if (activeStorage.clear) {
      await activeStorage.clear();
    }
    return await activeStorage.load();
  },

  subscribeToChanges(callback) {
    if (activeStorage.subscribe) {
      return activeStorage.subscribe(callback);
    }
    return null;
  },

  unsubscribe(channel) {
    if (activeStorage.unsubscribe) {
      activeStorage.unsubscribe(channel);
    }
  }
};
