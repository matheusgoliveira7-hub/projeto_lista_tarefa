/**
 * Formata uma string de data (YYYY-MM-DD) para formato legível em Português
 */
export function formatFriendlyDate(dateString) {
  if (!dateString) return 'Sem data';

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (targetDate.getTime() === today.getTime()) {
    return 'Hoje';
  }
  if (targetDate.getTime() === tomorrow.getTime()) {
    return 'Amanhã';
  }
  if (targetDate.getTime() === yesterday.getTime()) {
    return 'Ontem';
  }

  return targetDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: targetDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Verifica se a data está no passado (atrasada)
 */
export function isOverdue(dateString, isCompleted = false) {
  if (!dateString || isCompleted) return false;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return targetDate.getTime() < today.getTime();
}

/**
 * Retorna a data atual no formato YYYY-MM-DD
 */
export function getTodayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gera matriz de dias para exibição de calendário no mês especificado
 */
export function getCalendarGrid(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 0 = Domingo, 1 = Segunda, etc.
  const startDayOfWeek = firstDayOfMonth.getDay(); 

  const days = [];

  // Dias do mês anterior para completar o início da grade
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonthDate = new Date(year, month - 1, day);
    const dateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
    });
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: true,
    });
  }

  // Dias do próximo mês para fechar as semanas (múltiplo de 7)
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthDate = new Date(year, month + 1, day);
    const dateStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
    });
  }

  return days;
}
