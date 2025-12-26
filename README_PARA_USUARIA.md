# PromptMaster SaaS - Instruções de Instalação e GitHub

Olá! Preparei o código atualizado do seu projeto com todas as melhorias solicitadas:
- Tema Dark Moderno
- Estrutura completa de Categorias e Prompts
- Painéis de Login e Dashboard
- Dados de exemplo já configurados

## Como rodar no seu computador

Como percebi que você teve problemas com "command not found: npm" anteriormente, você precisa ter o **Node.js** instalado.

1. **Instale o Node.js**:
   - Baixe e instale a versão "LTS" aqui: https://nodejs.org/

2. **Abra o terminal na pasta do projeto**:
   - Descompacte o arquivo zip que vou te enviar.
   - Clique com botão direito na pasta > "Novo Terminal na Pasta" (ou abra o terminal e use `cd caminho/da/pasta`).

3. **Instale as dependências**:
   Digite o comando e aperte Enter:
   ```bash
   npm install
   ```

4. **Rode o projeto**:
   Digite e aperte Enter:
   ```bash
   npm run dev
   ```

5. **Acesse**:
   Abra seu navegador e vá para o link que aparecer, geralmente: `http://localhost:5173`

---

## Como colocar no GitHub (Jeito Mais Fácil: GitHub Desktop)

Eu não consigo acessar sua conta diretamente por questões de segurança e configuração do seu computador, mas existe um jeito **muito fácil** de você mesma fazer isso sem usar códigos, usando o aplicativo visual do GitHub:

1. **Baixe o GitHub Desktop**:
   - Acesse [desktop.github.com](https://desktop.github.com/) e instale.
   - Faça login com sua conta do GitHub nele.

2. **Adicione seu Projeto**:
   - Abra o GitHub Desktop.
   - Vá em `File` > `Add Local Repository` (Adicionar Repositório Local).
   - Escolha a pasta `promptmaster-saas` (a que você descompactou).
   - Se ele perguntar "This directory does not appear to be a Git repository", clique em **"Create a Repository"** (Criar repositório) ali mesmo.

3. **Publique**:
   - Clique no botão azul **"Publish repository"** na barra superior.
   - Dê o nome `promptmaster-saas`.
   - Clique em "Publish Repository".
   - Pronto! Está no seu GitHub.

4. **Coloque Online (Deploy)**:
   - Vá no site da [Vercel](https://vercel.com) e crie uma conta (Login com GitHub).
   - Clique em "Add New..." > "Project".
   - Selecione o `promptmaster-saas` da lista.
   - Clique em "Deploy".

Em minutos seu site estará acessível para o mundo todo!
