# TaskFlow Pro — Lista de Tarefas Inteligente

Aplicação web moderna, intuitiva e responsiva para gerenciamento de tarefas diárias (To-Do List), com suporte a categorização, prioridades, métricas de produtividade, visão de calendário e persistência completa em nuvem através do **Supabase** (com sincronização em tempo real e fallback offline).

---

## 🚀 Principais Funcionalidades

- **CRUD Completo de Tarefas:** Crie, visualize, edite, conclua e exclua tarefas rapidamente com atualizações otimistas na interface.
- **Categorização Visual:** Categorias temáticas (*Trabalho*, *Pessoal*, *Estudos*, *Saúde*) com cores e badges distintivos.
- **Priorização Inteligente:** Níveis de prioridade (*Alta*, *Média*, *Baixa*) com ordenação dinâmica.
- **Filtros e Busca em Tempo Real:** Filtragem por status (*Todas*, *Pendentes*, *Concluídas*), por categoria, por prioridade e busca textual por título/descrição.
- **Métricas e Análises:** Painel integrado de estatísticas com taxa de conclusão, contadores de tarefas e distribuição.
- **Visualização em Calendário:** Acompanhamento organizado por data de vencimento.
- **Persistência em Nuvem com Supabase:** Sincronização automática e eventos em tempo real (*Supabase Realtime*).
- **Modo Resiliente / Offline Fallback:** Caso a conexão com a nuvem esteja indisponível, o sistema armazena e lê localmente via `LocalStorage`.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Ícones & Animações:** [Lucide React](https://lucide.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend as a Service:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Linguagem:** JavaScript (ES Modules)

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- Gerenciador de pacotes `npm` (incluso com o Node.js) ou `yarn`/`pnpm`

---

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/matheusgoliveira7-hub/projeto_lista_tarefa.git
   cd projeto_lista_tarefa
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

---

## 🔐 Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e configure as credenciais do seu projeto Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

> **Nota:** Caso as variáveis não sejam informadas, a aplicação funcionará automaticamente utilizando o `LocalStorage` local para persistência.

---

## 💻 Como Executar em Desenvolvimento

Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

Acesse a aplicação no navegador em:
```
http://localhost:5173
```

---

## 🏗️ Como Gerar o Build de Produção

Para validar a integridade do código e compilar os arquivos estáticos otimizados para produção:

```bash
npm run build
```

Os arquivos compilados serão gerados no diretório `dist/`.

Para pré-visualizar o build localmente:

```bash
npm run preview
```

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

A tabela principal utilizada pelo projeto possui o seguinte esquema:

```sql
create table if not exists public.tasks (
  id text primary key,
  title text not null,
  description text default '',
  category text not null default 'PESSOAL',
  priority text not null default 'MEDIA',
  due_date text,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Políticas de RLS habilitadas para operações do aplicativo
alter table public.tasks enable row level security;
```

---

## 📁 Estrutura Resumida do Projeto

```text
├── .env.example              # Modelo de variáveis de ambiente
├── .gitignore                # Arquivos e diretórios ignorados pelo Git
├── index.html                # Ponto de entrada HTML
├── package.json              # Manifesto de dependências e scripts
├── tailwind.config.js        # Configuração do Tailwind CSS
├── vite.config.js            # Configuração do Vite
├── src/
│   ├── main.jsx              # Inicialização do React
│   ├── App.jsx               # Componente raiz da aplicação
│   ├── index.css             # Estilos globais e diretivas Tailwind
│   ├── components/
│   │   ├── analytics/        # Telas de métricas e gráficos
│   │   ├── calendar/         # Visão de tarefas em calendário
│   │   ├── common/           # Botões, modais e componentes reutilizáveis
│   │   ├── layout/           # Navbar, rodapé e diálogos
│   │   └── tasks/            # Lista de tarefas, filtros e formulários
│   ├── hooks/
│   │   └── useTasks.js       # Hook customizado de estado e sincronização
│   ├── services/
│   │   ├── supabaseClient.js # Instância do cliente Supabase
│   │   ├── storageAdapter.js # Adaptadores Supabase e LocalStorage
│   │   └── taskService.js    # Camada de regras de negócio das tarefas
│   ├── types/
│   │   └── taskConstants.js  # Constantes de categorias, prioridades e abas
│   └── utils/
│       ├── dateUtils.js      # Utilitários de formatação de datas
│       └── demoData.js       # Dados de demonstração padrão
```

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e profissionais. Sinta-se livre para utilizar e customizar conforme suas necessidades.
