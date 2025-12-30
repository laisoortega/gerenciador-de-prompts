# 🔥 BLAZE - Base de Conhecimento

## Visão Geral

**Nome:** Blaze  
**Tipo:** Aplicação SaaS (Software as a Service)  
**Categoria:** Produtividade / Gestão de Conteúdo para IA  
**Stack Tecnológico:** React, TypeScript, Tailwind CSS, Vite, Supabase (Backend/Auth/DB)  
**Status:** Em produção

---

## O Que É o Blaze?

O **Blaze** é um gerenciador de prompts para inteligência artificial projetado para profissionais que trabalham diariamente com modelos de linguagem (LLMs) como ChatGPT, Claude, Gemini, entre outros.

A plataforma permite criar, organizar, reutilizar e compartilhar prompts de forma eficiente, eliminando a necessidade de reescrever comandos repetitivos e garantindo consistência na comunicação com IAs.

---

## Público-Alvo

### Usuários Primários
- **Criadores de Conteúdo:** YouTubers, blogueiros, social media managers que usam IA para produção de conteúdo
- **Profissionais de Marketing:** Copywriters, gestores de tráfego, estrategistas digitais
- **Desenvolvedores:** Programadores que utilizam IA para code review, debugging, documentação
- **Empreendedores:** Donos de negócios que automatizam processos com IA
- **Educadores:** Professores e instrutores que criam materiais didáticos com auxílio de IA

### Características do Público
- Trabalham diariamente com ferramentas de IA
- Buscam produtividade e consistência
- Precisam organizar grande volume de prompts
- Valorizam colaboração e compartilhamento
- São early adopters de tecnologia

---

## Funcionalidades Principais

### 1. Gestão Completa de Prompts (CRUD)

- **Criar prompts** com título, descrição, conteúdo e metadados
- **Editar** prompts existentes a qualquer momento
- **Excluir** prompts não utilizados
- **Favoritar** prompts mais importantes para acesso rápido
- **Contador de cópias** para identificar prompts mais utilizados

### 2. Sistema de Variáveis Dinâmicas

O Blaze possui um sistema avançado de variáveis que permite criar prompts reutilizáveis:

```
Escreva uma copy para {{produto}} destinada a {{publico_alvo}} 
com tom {{tom_de_voz}} e foco em {{objetivo}}
```

**Tipos de variáveis disponíveis:**
- **Copy:** Variáveis para copywriting (produto, tom, objetivo, CTA, etc.)
- **Imagem:** Variáveis para geração de imagens (estilo, formato, cores, etc.)
- **Vídeo:** Variáveis para roteiros (duração, formato, plataforma, etc.)
- **Geral:** Variáveis universais (contexto, idioma, complexidade, etc.)
- **Personalizadas:** Usuário pode criar suas próprias categorias e variáveis

### 3. Biblioteca de Variáveis Pré-definidas

Conjunto de variáveis comuns prontas para uso:
- Público-alvo, produto, tom de voz, objetivo
- Estilo visual, paleta de cores, resolução
- Formato de vídeo, duração, plataforma
- E muito mais...

### 4. Múltiplas Visualizações

O usuário pode escolher como visualizar seus prompts:

| Visualização | Descrição |
|-------------|-----------|
| **Cards** | Grade de cards visuais com preview do prompt |
| **Tabela** | Lista detalhada com colunas ordenáveis |
| **Kanban** | Organização por categorias em estilo board |
| **Pastas** | Navegação hierárquica por categorias |

### 5. Sistema de Categorias Hierárquicas

- Categorias pai e subcategorias (até 3 níveis)
- Cores personalizáveis para identificação visual
- Ícones ou iniciais para cada categoria
- Drag-and-drop para reorganização
- Contagem automática de prompts por categoria

### 6. Filtros Avançados

- **Busca textual** em título, descrição e conteúdo
- **Filtro por categoria** (incluindo subcategorias)
- **Filtro por tags** personalizadas
- **Filtro de favoritos**
- **Filtro por IA recomendada** (ChatGPT, Claude, etc.)
- **Ordenação** (mais recentes, mais antigos, A-Z, Z-A)

### 7. Compartilhamento de Prompts

- Compartilhar prompts com outros usuários por email
- Níveis de permissão: visualizar, editar, controle total
- Notificações em tempo real
- Revogar acesso a qualquer momento
- Seção "Compartilhados Comigo" para prompts recebidos

### 8. Uso e Execução de Prompts

- **Modal de uso** que permite preencher variáveis antes de copiar
- **Preview em tempo real** do prompt final
- **Botão de copiar** com confirmação visual
- **Executar prompt** diretamente em plataformas:
  - ChatGPT (chat.openai.com)
  - Claude (claude.ai)
  - Gemini (gemini.google.com)
  - Perplexity (perplexity.ai)

### 9. Importação/Exportação de Dados

- Exportar todos os prompts em formato JSON
- Importar prompts de backup
- Migração facilitada entre contas

### 10. Temas e Personalização

- **Modo escuro** (padrão) com design premium
- **Modo claro** disponível
- **Tema do sistema** para seguir preferência do SO
- Interface responsiva para desktop, tablet e mobile

---

## Funcionalidades Administrativas (Painel Admin)

O Blaze possui um painel administrativo completo para gestão da plataforma:

### Dashboard Admin
- Métricas de usuários ativos
- Total de prompts criados
- Receita mensal
- Uso de API
- Gráficos de crescimento
- Atividade recente

### Gestão de Usuários
- Listar todos os usuários
- Criar novos usuários
- Editar perfis e permissões
- Suspender/ativar contas
- Atribuir planos

### Gestão de Planos
- Criar e editar planos de assinatura
- Definir limites (prompts, categorias, workspaces)
- Configurar preços mensais e anuais
- Definir features de cada plano

### Configurações do Sistema
- Parâmetros globais da aplicação
- Configurações de email
- Integrações externas

---

## Planos e Preços

| Plano | Preço | Prompts | Categorias | Workspaces | Compartilhamento |
|-------|-------|---------|------------|------------|------------------|
| **Free** | R$ 0 | 25 | 5 | 1 | ❌ |
| **Pro** | R$ 29/mês | 500 | 50 | 5 | ✅ |
| **Business** | R$ 99/mês | Ilimitados | Ilimitados | Ilimitados | ✅ |

---

## Diferenciais de Mercado

### 1. **Foco Específico em Prompts**
Diferente de ferramentas genéricas de notas ou documentos, o Blaze foi construído especificamente para gerenciar prompts de IA, com features dedicadas como variáveis dinâmicas e integração direta com plataformas de IA.

### 2. **Sistema de Variáveis Robusto**
Biblioteca de variáveis pré-construídas + possibilidade de criar categorias e variáveis personalizadas. Isso economiza tempo e garante consistência.

### 3. **Múltiplas Visualizações**
4 formas diferentes de visualizar os mesmos dados (Cards, Tabela, Kanban, Pastas), atendendo diferentes estilos de trabalho.

### 4. **Execução Direta**
Executar prompts diretamente no ChatGPT, Claude, Gemini e Perplexity com um clique, sem copiar e colar manualmente.

### 5. **Compartilhamento Granular**
Compartilhar prompts específicos com níveis de permissão (view, edit, full), ideal para equipes e colaboração.

### 6. **Design Premium**
Interface moderna com modo escuro, animações suaves, design responsivo, pensada para uso profissional prolongado.

### 7. **100% em Português Brasileiro**
Interface, mensagens e documentação completamente em português, sem traduções genéricas.

### 8. **Hierarquia de Categorias**
Organização profunda com categorias e subcategorias, essencial para quem trabalha com muitos prompts em diferentes contextos.

---

## Stack Tecnológico Detalhado

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Vite** - Build tool e dev server
- **React Router** - Navegação SPA
- **React Query (TanStack)** - Cache e sincronização de dados
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **DnD Kit / Hello Pangea DnD** - Drag and drop
- **React Table (TanStack)** - Tabelas avançadas
- **Chart.js** - Gráficos no admin

### Backend
- **Supabase** - Backend as a Service
  - Autenticação (email/senha, OAuth)
  - Banco de dados PostgreSQL
  - Row Level Security (RLS) para segurança
  - Realtime subscriptions para compartilhamento
- **Edge Functions** - APIs serverless (quando necessário)

### Infraestrutura
- **Vercel** - Deploy e hospedagem
- **GitHub** - Controle de versão

---

## Fluxos Principais

### Fluxo de Criação de Prompt
1. Usuário clica em "Novo Prompt"
2. Preenche título, descrição e conteúdo
3. Insere variáveis usando sintaxe `{{variavel}}` ou biblioteca
4. Seleciona categoria, tags e IA recomendada
5. Salva → Prompt aparece na visualização ativa

### Fluxo de Uso de Prompt
1. Usuário clica em "Usar" no prompt desejado
2. Modal abre com formulário de variáveis
3. Preenche valores para cada variável
4. Preview atualiza em tempo real
5. Copia ou executa diretamente na IA escolhida

### Fluxo de Compartilhamento
1. Usuário clica em "Compartilhar" no prompt
2. Insere email(s) dos destinatários
3. Define nível de permissão
4. Adiciona mensagem opcional
5. Envia → Destinatário recebe em "Compartilhados Comigo"

---

## Estrutura de Dados Principal

### Prompt
```typescript
{
  id: string;
  title: string;
  description?: string;
  content: string;
  category_id?: string;
  variables: { name: string; value?: string; placeholder?: string }[];
  tags: string[];
  recommended_ai?: 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | ...;
  is_favorite: boolean;
  copy_count: number;
  created_at: string;
  updated_at: string;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  parent_id: string | null;
  color: string;
  icon?: string;
  depth: number;
  order_index: number;
  prompt_count?: number;
}
```

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'user';
  plan_id: 'free' | 'pro' | 'business';
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  prompts_count: number;
  categories_count: number;
}
```

---

## IAs Suportadas para Recomendação

| IA | Tipo | URL |
|----|------|-----|
| ChatGPT | Chat/Texto | chat.openai.com |
| Claude | Chat/Texto | claude.ai |
| Gemini | Chat/Texto | gemini.google.com |
| Perplexity | Pesquisa | perplexity.ai |
| Grok | Chat/Texto | - |
| Manus | Agente | - |
| Whisk | Imagem | - |
| Midjourney | Imagem | - |
| DALL-E | Imagem | - |
| Ideogram | Imagem | - |
| Leonardo AI | Imagem | - |

---

## Contato e Suporte

Para dúvidas sobre o Blaze, funcionalidades ou integrações, entre em contato com a equipe de desenvolvimento.

---

*Documento atualizado em: Dezembro/2024*
*Versão: 1.0.0*
