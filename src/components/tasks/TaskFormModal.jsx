import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CATEGORIES, PRIORITIES } from '../../types/taskConstants';
import { getTodayISODate } from '../../utils/dateUtils';
import { Calendar, Tag, AlertCircle } from 'lucide-react';

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('TRABALHO');
  const [priority, setPriority] = useState('MEDIA');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'TRABALHO');
      setPriority(initialData.priority || 'MEDIA');
      setDueDate(initialData.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('TRABALHO');
      setPriority('MEDIA');
      setDueDate(getTodayISODate());
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'O título da tarefa é obrigatório.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
    });

    onClose();
  };

  const isEditing = !!initialData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* Campo Título */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Título da Tarefa <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Entregar relatório mensal para diretoria"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            autoFocus
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
              errors.title
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 focus:border-indigo-500'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
            </p>
          )}
        </div>

        {/* Campo Descrição */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Descrição (Opcional)
          </label>
          <textarea
            rows={3}
            placeholder="Detalhes adicionais, links ou passos para conclusão..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        {/* Seletor Visual de Categoria */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Categoria
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(CATEGORIES).map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? `${cat.color} ring-2 shadow-sm`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Linha com Prioridade & Data de Vencimento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Prioridade */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Prioridade
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.values(PRIORITIES).map((prio) => {
                const isSelected = priority === prio.id;
                return (
                  <button
                    type="button"
                    key={prio.id}
                    onClick={() => setPriority(prio.id)}
                    className={`flex items-center justify-center py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? `${prio.color} ring-2 shadow-sm`
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {prio.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Data de Vencimento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            />
          </div>

        </div>

        {/* Botões de Ação */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </div>

      </form>
    </Modal>
  );
}
