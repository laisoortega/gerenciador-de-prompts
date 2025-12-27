-- Script para adicionar variáveis padrão a um usuário existente
-- Execute no Supabase SQL Editor

-- Primeiro, descubra seu user_id (pegue da tabela auth.users ou das variáveis que você já criou)
-- SELECT DISTINCT user_id FROM custom_variables;

-- Substitua 'SEU_USER_ID_AQUI' pelo seu user_id real
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Pega o user_id das variáveis existentes (assumindo que só tem 1 usuário)
    SELECT DISTINCT user_id INTO v_user_id FROM custom_variables LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Nenhum user_id encontrado na tabela custom_variables';
    END IF;
    
    RAISE NOTICE 'Adicionando variáveis para user_id: %', v_user_id;

    -- Inserir variáveis padrão (apenas as que não existem ainda)
    INSERT INTO custom_variables (user_id, name, label, description, type, category, options, placeholder, order_index, is_active)
    SELECT 
        v_user_id,
        v.name,
        v.label,
        v.description,
        v.type,
        v.category,
        v.options::jsonb,
        v.placeholder,
        v.order_index,
        true
    FROM (VALUES
        -- Copywriting
        ('tom_de_voz', 'Tom de Voz', 'Personalidade da comunicação', 'select', 'copywriting', 
         '[{"value":"profissional","label":"Profissional"},{"value":"casual","label":"Casual/Conversacional"},{"value":"empatico","label":"Empático/Acolhedor"},{"value":"persuasivo","label":"Persuasivo/Vendas"},{"value":"inspirador","label":"Inspirador/Motivacional"}]',
         NULL, 0),
        ('publico_alvo', 'Público-Alvo', 'Quem é o destinatário da mensagem', 'text', 'copywriting', '[]', 'Ex: Empreendedores digitais 25-45 anos', 1),
        ('objetivo', 'Objetivo', 'O que a copy deve alcançar', 'select', 'copywriting',
         '[{"value":"vender","label":"Vender/Converter"},{"value":"leads","label":"Capturar Leads"},{"value":"engajar","label":"Engajar/Interagir"},{"value":"educar","label":"Educar/Informar"}]',
         NULL, 2),
        
        -- Universal
        ('nome_marca', 'Nome da Marca', 'Nome da empresa/marca', 'text', 'universal', '[]', 'Ex: PromptMaster', 3),
        ('produto', 'Produto/Serviço', 'O que está sendo oferecido', 'text', 'universal', '[]', 'Ex: Curso de Marketing Digital', 4),
        ('idioma', 'Idioma', 'Idioma do conteúdo', 'select', 'universal',
         '[{"value":"pt-br","label":"Português (Brasil)"},{"value":"en-us","label":"Inglês (EUA)"},{"value":"es","label":"Espanhol"}]',
         NULL, 5),
        
        -- Imagens
        ('estilo_visual', 'Estilo Visual', 'Define a estética visual geral', 'select', 'imagens',
         '[{"value":"fotografia_realista","label":"Fotografia Realista"},{"value":"ilustracao_digital","label":"Ilustração Digital"},{"value":"3d_render","label":"Renderização 3D"},{"value":"minimalista","label":"Minimalista"}]',
         NULL, 6),
        ('proporcao', 'Proporção', 'Aspect ratio da imagem', 'select', 'imagens',
         '[{"value":"1:1","label":"1:1 (Quadrado)"},{"value":"9:16","label":"9:16 (Stories/Reels)"},{"value":"16:9","label":"16:9 (Widescreen)"}]',
         NULL, 7),
        
        -- Videos
        ('formato_video', 'Formato de Vídeo', 'Tipo/formato do vídeo', 'select', 'videos',
         '[{"value":"reels","label":"Reels/TikTok"},{"value":"youtube","label":"YouTube"},{"value":"stories","label":"Stories"}]',
         NULL, 8),
        ('duracao', 'Duração', 'Tempo do vídeo', 'select', 'videos',
         '[{"value":"15s","label":"15 segundos"},{"value":"60s","label":"60 segundos"},{"value":"3min","label":"3 minutos"}]',
         NULL, 9)
    ) AS v(name, label, description, type, category, options, placeholder, order_index)
    WHERE NOT EXISTS (
        SELECT 1 FROM custom_variables cv 
        WHERE cv.user_id = v_user_id AND cv.name = v.name
    );

    RAISE NOTICE 'Variáveis padrão adicionadas com sucesso!';
END $$;

-- Verificar as variáveis criadas
SELECT name, label, category, type FROM custom_variables ORDER BY order_index;
