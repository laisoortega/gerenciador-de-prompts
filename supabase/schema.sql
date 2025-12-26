-- Tabela de compartilhamentos
CREATE TABLE prompt_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Prompt sendo compartilhado
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  
  -- Quem está compartilhando (dono do prompt)
  shared_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Com quem está compartilhando
  shared_with_email VARCHAR(255) NOT NULL,
  shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  -- shared_with_user_id é preenchido quando o usuário existe na plataforma
  -- Se não existe, fica NULL e é atualizado quando o usuário se cadastrar
  
  -- Permissões
  permission VARCHAR(20) NOT NULL DEFAULT 'view',
  -- 'view' = apenas visualizar e copiar
  -- 'edit' = pode editar o prompt original
  -- 'full' = pode editar e re-compartilhar
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- 'pending' = aguardando usuário existir na plataforma ou aceitar
  -- 'active' = compartilhamento ativo
  -- 'revoked' = revogado pelo dono
  -- 'declined' = recusado pelo destinatário
  
  -- Metadados
  message TEXT, -- Mensagem opcional do remetente
  accepted_at TIMESTAMP,
  revoked_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(prompt_id, shared_with_email)
);

-- Índices para performance
CREATE INDEX idx_prompt_shares_prompt ON prompt_shares(prompt_id);
CREATE INDEX idx_prompt_shares_shared_by ON prompt_shares(shared_by);
CREATE INDEX idx_prompt_shares_shared_with_user ON prompt_shares(shared_with_user_id);
CREATE INDEX idx_prompt_shares_shared_with_email ON prompt_shares(shared_with_email);
CREATE INDEX idx_prompt_shares_status ON prompt_shares(status);

-- Tabela para rastrear cópias de prompts compartilhados
CREATE TABLE prompt_copies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Prompt original (compartilhado)
  original_prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE SET NULL,
  
  -- Prompt copiado (novo, pertence ao usuário)
  copied_prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  
  -- Quem copiou
  copied_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- De qual compartilhamento veio
  share_id UUID REFERENCES prompt_shares(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger para vincular compartilhamento quando usuário se cadastrar
CREATE OR REPLACE FUNCTION link_pending_shares()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prompt_shares
  SET 
    shared_with_user_id = NEW.id,
    status = 'active',
    accepted_at = NOW()
  WHERE 
    shared_with_email = NEW.email 
    AND status = 'pending'
    AND shared_with_user_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_link_pending_shares
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION link_pending_shares();

-- Adicionar campo ao prompts para indicar se é compartilhável
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS is_shareable BOOLEAN DEFAULT TRUE;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;

-- Tabela de variáveis comuns do sistema
CREATE TABLE common_variables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identificação
  name VARCHAR(100) NOT NULL,          -- Nome técnico (ex: tone, style, emotion)
  label VARCHAR(200) NOT NULL,          -- Label exibido (ex: "Tom de Voz")
  placeholder VARCHAR(255),             -- Placeholder no input
  description TEXT,                     -- Descrição de ajuda
  
  -- Categorização
  category VARCHAR(50) NOT NULL,        -- 'copy', 'image', 'video', 'general'
  
  -- Opções pré-definidas (para selects)
  options JSONB,                        -- Ex: ["Formal", "Casual", "Humorístico"]
  
  -- Tipo de input
  input_type VARCHAR(20) DEFAULT 'text', -- 'text', 'select', 'multiselect', 'textarea'
  
  -- Ordenação e status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed de variáveis comuns
INSERT INTO common_variables (name, label, placeholder, description, category, options, input_type, order_index) VALUES

-- VARIÁVEIS PARA COPY
('tone', 'Tom de Voz', 'Ex: Profissional, Casual', 'O tom que a copy deve transmitir', 'copy', 
 '["Profissional", "Casual", "Humorístico", "Urgente", "Empático", "Autoritário", "Inspirador", "Provocativo", "Educativo", "Amigável"]', 
 'select', 1),

('target_audience', 'Público-Alvo', 'Ex: Empreendedores 25-40 anos', 'Quem é o público-alvo da copy', 'copy', NULL, 'text', 2),

('pain_point', 'Dor/Problema', 'Ex: Falta de tempo para estudar', 'Principal dor que a copy deve abordar', 'copy', NULL, 'textarea', 3),

('desired_action', 'Ação Desejada', 'Ex: Clicar no botão, Comprar', 'O que o leitor deve fazer após ler', 'copy', 
 '["Clicar no botão", "Comprar agora", "Agendar reunião", "Baixar material", "Inscrever-se", "Entrar em contato", "Compartilhar", "Assistir vídeo"]', 
 'select', 4),

('benefit', 'Benefício Principal', 'Ex: Economizar 10 horas por semana', 'Principal benefício do produto/serviço', 'copy', NULL, 'text', 5),

('urgency', 'Urgência', NULL, 'Nível de urgência da copy', 'copy', 
 '["Baixa", "Média", "Alta", "Última chance"]', 
 'select', 6),

('copy_length', 'Tamanho', NULL, 'Tamanho aproximado da copy', 'copy', 
 '["Curta (até 100 palavras)", "Média (100-300 palavras)", "Longa (300+ palavras)"]', 
 'select', 7),

('platform', 'Plataforma', NULL, 'Onde a copy será usada', 'copy', 
 '["Instagram", "Facebook", "LinkedIn", "Email", "Landing Page", "WhatsApp", "YouTube", "TikTok", "Anúncio"]', 
 'multiselect', 8),

-- VARIÁVEIS PARA IMAGENS
('style', 'Estilo Visual', 'Ex: Minimalista, Vibrante', 'Estilo visual da imagem', 'image', 
 '["Fotorrealista", "Ilustração", "3D Render", "Minimalista", "Vintage", "Futurista", "Aquarela", "Cartoon", "Flat Design", "Isométrico", "Arte Conceitual", "Pixel Art"]', 
 'select', 1),

('emotion', 'Emoção', NULL, 'Emoção que a imagem deve transmitir', 'image', 
 '["Alegria", "Serenidade", "Energia", "Mistério", "Confiança", "Nostalgia", "Empolgação", "Tranquilidade", "Poder", "Acolhimento"]', 
 'select', 2),

('color_palette', 'Paleta de Cores', 'Ex: Tons quentes, Azul e dourado', 'Cores predominantes', 'image', 
 '["Tons quentes", "Tons frios", "Preto e branco", "Pastel", "Vibrante/Saturado", "Monocromático", "Terra/Natural", "Neon"]', 
 'select', 3),

('lighting', 'Iluminação', NULL, 'Tipo de iluminação', 'image', 
 '["Natural", "Estúdio", "Dramática", "Suave", "Backlight", "Golden Hour", "Neon", "Cinematográfica"]', 
 'select', 4),

('aspect_ratio', 'Proporção', NULL, 'Proporção da imagem', 'image', 
 '["1:1 (Quadrado)", "4:5 (Instagram)", "9:16 (Stories)", "16:9 (Widescreen)", "3:2 (Fotografia)", "2:3 (Pinterest)"]', 
 'select', 5),

('composition', 'Composição', NULL, 'Tipo de composição', 'image', 
 '["Centralizado", "Regra dos terços", "Simetria", "Close-up", "Plano aberto", "Vista aérea", "Perspectiva forçada"]', 
 'select', 6),

-- VARIÁVEIS PARA VÍDEO/ROTEIRO
('video_duration', 'Duração', NULL, 'Duração aproximada do vídeo', 'video', 
 '["15 segundos", "30 segundos", "60 segundos", "2-3 minutos", "5-10 minutos", "10+ minutos"]', 
 'select', 1),

('video_format', 'Formato', NULL, 'Formato do vídeo', 'video', 
 '["Reels/TikTok", "Stories", "YouTube", "Anúncio", "Podcast", "Webinar", "Tutorial"]', 
 'select', 2),

('hook_style', 'Estilo de Gancho', NULL, 'Como começar o vídeo', 'video', 
 '["Pergunta provocativa", "Estatística chocante", "Promessa de benefício", "Polêmica", "Storytelling", "Dor/Problema", "Curiosidade"]', 
 'select', 3),

('cta_type', 'Tipo de CTA', NULL, 'Call to action do vídeo', 'video', 
 '["Seguir perfil", "Comentar", "Salvar", "Compartilhar", "Link na bio", "Comprar", "Inscrever-se"]', 
 'select', 4),

-- VARIÁVEIS GERAIS
('language', 'Idioma', NULL, 'Idioma do conteúdo', 'general', 
 '["Português (Brasil)", "Português (Portugal)", "Inglês", "Espanhol"]', 
 'select', 1),

('brand_voice', 'Voz da Marca', 'Ex: Jovem e descontraída', 'Personalidade da marca', 'general', NULL, 'text', 2),

('keywords', 'Palavras-chave', 'Ex: marketing, vendas, conversão', 'Keywords importantes', 'general', NULL, 'text', 3);

-- Índices
CREATE INDEX idx_common_variables_category ON common_variables(category);
CREATE INDEX idx_common_variables_active ON common_variables(is_active);

-- Tabela para armazenar análises de vídeos
CREATE TABLE video_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Usuário que fez a análise
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Informações do vídeo
  platform VARCHAR(20) NOT NULL, -- 'youtube', 'instagram', 'tiktok'
  video_url TEXT NOT NULL,
  video_id VARCHAR(100),
  
  -- Metadados extraídos
  title TEXT,
  description TEXT,
  duration INTEGER, -- em segundos
  thumbnail_url TEXT,
  channel_name TEXT,
  channel_url TEXT,
  view_count INTEGER,
  like_count INTEGER,
  
  -- Análise do conteúdo
  transcript TEXT,                    -- Transcrição do áudio
  analysis JSONB,                     -- Análise estruturada (gancho, desenvolvimento, CTA, etc)
  generated_prompt_template TEXT,     -- Template de prompt gerado
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  error_message TEXT,
  
  -- Relacionamento com prompt (se usuário criar prompt a partir da análise)
  prompt_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_video_analyses_user ON video_analyses(user_id);
CREATE INDEX idx_video_analyses_status ON video_analyses(status);
CREATE INDEX idx_video_analyses_platform ON video_analyses(platform);
