import React from 'react';
import { CheckSquare, BarChart3, Calendar as CalendarIcon, LogOut, Plus, Sparkles, Database } from 'lucide-react';
import { NAVIGATION_TABS } from '../../types/taskConstants';
import { Button } from '../common/Button';

export function Navbar({
  activeTab,
  onTabChange,
  onOpenNewTaskModal,
  onLogoutClick,
  stats,
  isSyncing,
}) {
  const navItems = [
    {
      id: NAVIGATION_TABS.TAREFAS,
      label: 'Tarefas',
      icon: CheckSquare,
      badge: stats.pending > 0 ? stats.pending : null,
    },
    {
      id: NAVIGATION_TABS.ANALISES,
      label: 'Análises',
      icon: BarChart3,
    },
    {
      id: NAVIGATION_TABS.CALENDARIO,
      label: 'Calendário',
      icon: CalendarIcon,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-soft-sm shadow-indigo-200">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-800 tracking-tight">TaskFlow</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                  Pro
                </span>
                
                {/* Indicador de Conexão com Supabase */}
                <div
                  title="Persistência ativa no Supabase (projeto: lista-tarefa)"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                    isSyncing
                      ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>{isSyncing ? 'Sincronizando...' : 'Supabase Conectado'}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Gerenciamento inteligente</p>
            </div>
          </div>

          {/* Abas Centrais */}
          <nav className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-soft-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className="w-4 h-4 text-[10px] flex items-center justify-center font-bold rounded-full bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Ações à Direita */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onOpenNewTaskModal}
              className="hidden sm:inline-flex shadow-sm hover:shadow"
            >
              Nova Tarefa
            </Button>

            <button
              onClick={onLogoutClick}
              title="Restaurar tarefas padrão"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 border border-transparent hover:border-rose-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
