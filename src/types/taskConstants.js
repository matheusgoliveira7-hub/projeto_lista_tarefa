export const CATEGORIES = {
  TRABALHO: {
    id: 'TRABALHO',
    label: 'Trabalho',
    color: 'bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/20',
    badgeClass: 'bg-blue-100/70 text-blue-700 border border-blue-200',
    dotColor: 'bg-blue-500',
    icon: 'Briefcase',
  },
  PESSOAL: {
    id: 'PESSOAL',
    label: 'Pessoal',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/20',
    badgeClass: 'bg-emerald-100/70 text-emerald-700 border border-emerald-200',
    dotColor: 'bg-emerald-500',
    icon: 'User',
  },
  ESTUDOS: {
    id: 'ESTUDOS',
    label: 'Estudos',
    color: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/20',
    badgeClass: 'bg-amber-100/70 text-amber-700 border border-amber-200',
    dotColor: 'bg-amber-500',
    icon: 'GraduationCap',
  },
  SAUDE: {
    id: 'SAUDE',
    label: 'Saúde',
    color: 'bg-teal-50 text-teal-700 border-teal-200/80 ring-teal-500/20',
    badgeClass: 'bg-teal-100/70 text-teal-700 border border-teal-200',
    dotColor: 'bg-teal-500',
    icon: 'Heart',
  },
};

export const PRIORITIES = {
  ALTA: {
    id: 'ALTA',
    label: 'Alta',
    color: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/20',
    badgeClass: 'bg-rose-100/80 text-rose-700 border border-rose-200 font-semibold',
    dotColor: 'bg-rose-500',
    weight: 3,
  },
  MEDIA: {
    id: 'MEDIA',
    label: 'Média',
    color: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/20',
    badgeClass: 'bg-amber-100/80 text-amber-700 border border-amber-200 font-semibold',
    dotColor: 'bg-amber-500',
    weight: 2,
  },
  BAIXA: {
    id: 'BAIXA',
    label: 'Baixa',
    color: 'bg-slate-100 text-slate-700 border-slate-200/80 ring-slate-500/20',
    badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200 font-medium',
    dotColor: 'bg-slate-400',
    weight: 1,
  },
};

export const STATUS_FILTERS = {
  TODAS: 'TODAS',
  PENDENTES: 'PENDENTES',
  CONCLUIDAS: 'CONCLUIDAS',
};

export const NAVIGATION_TABS = {
  TAREFAS: 'TAREFAS',
  ANALISES: 'ANALISES',
  CALENDARIO: 'CALENDARIO',
};
