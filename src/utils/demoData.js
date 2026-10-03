import { getTodayISODate } from './dateUtils';

const today = new Date();

function getRelativeDate(daysOffset) {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_DEMO_TASKS = [
  {
    id: 'demo-1',
    title: 'Finalizar apresentação do projeto trimestral',
    description: 'Revisar os slides no Canva e alinhar os indicadores com o time de liderança.',
    category: 'TRABALHO',
    priority: 'ALTA',
    dueDate: getRelativeDate(0), // Hoje
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Estudar módulo avançado de React e Tailwind CSS',
    description: 'Completar os exercícios práticos de composição de componentes e design tokens.',
    category: 'ESTUDOS',
    priority: 'MEDIA',
    dueDate: getRelativeDate(1), // Amanhã
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Treino de corrida no parque',
    description: 'Meta de 5km em ritmo moderado para manter o condicionamento físico.',
    category: 'SAUDE',
    priority: 'BAIXA',
    dueDate: getRelativeDate(2),
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Comprar suprimentos e mantimentos da semana',
    description: 'Passar no mercado para itens frescos e produtos essenciais de casa.',
    category: 'PESSOAL',
    priority: 'MEDIA',
    dueDate: getRelativeDate(3),
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Revisar proposta técnica de integração com Supabase',
    description: 'Validar schema das tabelas de tasks e políticas de segurança RLS.',
    category: 'TRABALHO',
    priority: 'ALTA',
    dueDate: getRelativeDate(5),
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];
