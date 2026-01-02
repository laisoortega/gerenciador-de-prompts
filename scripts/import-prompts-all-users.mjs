/**
 * Script de Importação de Prompts para Todos os Usuários
 * 
 * Este script importa prompts de um arquivo JSON para todos os usuários existentes.
 * 
 * REQUISITOS:
 * - Deve ser executado com Node.js 18+
 * - Requer a SERVICE ROLE KEY do Supabase (não a anon key)
 * 
 * USO:
 * 1. Defina a variável SUPABASE_SERVICE_ROLE_KEY abaixo ou como env var
 * 2. Execute: node scripts/import-prompts-all-users.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// ============================================
// CONFIGURAÇÃO
// ============================================

// URL do Supabase
const SUPABASE_URL = 'https://xjvbpoikcaerccakvaqx.supabase.co';

// ⚠️ IMPORTANTE: Use a SERVICE ROLE KEY (não a anon key)
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdmJwb2lrY2FlcmNjYWt2YXF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NDE4OCwiZXhwIjoyMDgyNTIwMTg4fQ.ltyyVSuMrYI5Xd1M--4GLx7tUUC6Z4HdDZLpT1viqnI';

// Arquivo de importação
const IMPORT_FILE = '/Users/laisortega/Downloads/prompts_import.json';

// ============================================
// INICIALIZAÇÃO
// ============================================

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Cores para tabelas de categorias (palette premium)
const categoryColors = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#f43f5e', // rose
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
];

function getColorForCategory(index) {
    return categoryColors[index % categoryColors.length];
}

function normalizeCategory(category) {
    if (!category || category.trim() === '') return 'Geral';
    return category.trim();
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

async function getAllUsers() {
    console.log('📋 Buscando todos os usuários...');

    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
        throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }

    console.log(`   ✓ Encontrados ${data.users.length} usuário(s)`);
    return data.users;
}

async function getOrCreateWorkspace(userId) {
    // Buscar workspace existente
    const { data: existing, error: fetchError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId)
        .eq('is_default', true)
        .single();

    if (existing) {
        return existing;
    }

    // Criar workspace se não existir
    const slug = `workspace-${userId.slice(0, 8)}-${Date.now()}`;
    const { data: newWorkspace, error: createError } = await supabase
        .from('workspaces')
        .insert({
            owner_id: userId,
            name: 'Meu Workspace',
            slug: slug,
            is_default: true
        })
        .select()
        .single();

    if (createError) {
        throw new Error(`Erro ao criar workspace: ${createError.message}`);
    }

    return newWorkspace;
}

async function getOrCreateCategory(userId, workspaceId, categoryName, existingCategories, colorIndex) {
    const normalizedName = normalizeCategory(categoryName);

    // Verificar se já existe no cache
    if (existingCategories.has(normalizedName)) {
        return existingCategories.get(normalizedName);
    }

    // Buscar no banco
    const { data: existing, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId)
        .eq('name', normalizedName)
        .single();

    if (existing) {
        existingCategories.set(normalizedName, existing.id);
        return existing.id;
    }

    // Criar nova categoria
    const { data: newCategory, error: createError } = await supabase
        .from('categories')
        .insert({
            user_id: userId,
            workspace_id: workspaceId,
            name: normalizedName,
            color: getColorForCategory(colorIndex),
            order_index: colorIndex
        })
        .select()
        .single();

    if (createError) {
        console.warn(`   ⚠️ Erro ao criar categoria "${normalizedName}": ${createError.message}`);
        return null;
    }

    existingCategories.set(normalizedName, newCategory.id);
    return newCategory.id;
}

async function importPromptsForUser(userId, userEmail, workspace, prompts) {
    console.log(`\n📦 Importando para: ${userEmail}`);
    console.log(`   Workspace: ${workspace.id}`);

    const existingCategories = new Map();
    let categoryColorIndex = 0;
    let successCount = 0;
    let errorCount = 0;

    // Primeiro, buscar todas as categorias existentes do usuário
    const { data: userCategories } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', userId);

    if (userCategories) {
        userCategories.forEach(cat => {
            existingCategories.set(cat.name, cat.id);
            categoryColorIndex++;
        });
    }

    // Verificar prompts já existentes (por título) para evitar duplicação
    const { data: existingPrompts } = await supabase
        .from('prompts')
        .select('title')
        .eq('user_id', userId);

    const existingTitles = new Set(existingPrompts?.map(p => p.title) || []);

    // Processar prompts em lotes
    const BATCH_SIZE = 50;
    const promptsToInsert = [];

    for (const prompt of prompts) {
        // Pular se já existe prompt com mesmo título
        if (existingTitles.has(prompt.title)) {
            continue;
        }

        // Obter/criar categoria
        const categoryId = await getOrCreateCategory(
            userId,
            workspace.id,
            prompt.category,
            existingCategories,
            categoryColorIndex++
        );

        promptsToInsert.push({
            user_id: userId,
            workspace_id: workspace.id,
            category_id: categoryId,
            title: prompt.title,
            content: prompt.content,
            variables: prompt.variables || [],
            tags: prompt.tags || [],
            recommended_ai: prompt.recommended_ai || null,
            is_favorite: prompt.is_favorite || false,
            copy_count: 0,
            order_index: successCount
        });

        successCount++;
    }

    // Inserir em lotes
    for (let i = 0; i < promptsToInsert.length; i += BATCH_SIZE) {
        const batch = promptsToInsert.slice(i, i + BATCH_SIZE);

        const { error } = await supabase
            .from('prompts')
            .insert(batch);

        if (error) {
            console.error(`   ❌ Erro no lote ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
            errorCount += batch.length;
        } else {
            process.stdout.write(`   📝 Lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(promptsToInsert.length / BATCH_SIZE)} inserido\r`);
        }

        // Pequena pausa para não sobrecarregar o banco
        await sleep(100);
    }

    console.log(`\n   ✓ ${promptsToInsert.length} prompts importados (${existingTitles.size} já existiam)`);

    return { success: promptsToInsert.length, errors: errorCount, skipped: existingTitles.size };
}

// ============================================
// EXECUÇÃO
// ============================================

async function main() {
    console.log('\n🚀 IMPORTAÇÃO DE PROMPTS PARA TODOS OS USUÁRIOS\n');
    console.log('='.repeat(50));

    // 1. Carregar arquivo JSON
    console.log(`\n📂 Carregando arquivo: ${IMPORT_FILE}`);

    if (!fs.existsSync(IMPORT_FILE)) {
        console.error('❌ Arquivo não encontrado!');
        process.exit(1);
    }

    const jsonContent = fs.readFileSync(IMPORT_FILE, 'utf8');
    const importData = JSON.parse(jsonContent);

    console.log(`   ✓ ${importData.prompts?.length || 0} prompts carregados`);
    console.log(`   Versão: ${importData.version}`);
    console.log(`   Exportado em: ${importData.exported_at}`);

    const prompts = importData.prompts || [];

    if (prompts.length === 0) {
        console.error('❌ Nenhum prompt encontrado no arquivo!');
        process.exit(1);
    }

    // 2. Buscar todos os usuários
    const users = await getAllUsers();

    if (users.length === 0) {
        console.log('⚠️ Nenhum usuário encontrado!');
        process.exit(0);
    }

    // 3. Importar para cada usuário
    const results = {
        users: 0,
        totalPrompts: 0,
        totalErrors: 0,
        totalSkipped: 0
    };

    for (const user of users) {
        try {
            const workspace = await getOrCreateWorkspace(user.id);
            const result = await importPromptsForUser(user.id, user.email, workspace, prompts);

            results.users++;
            results.totalPrompts += result.success;
            results.totalErrors += result.errors;
            results.totalSkipped += result.skipped;
        } catch (err) {
            console.error(`\n❌ Erro ao processar usuário ${user.email}: ${err.message}`);
        }
    }

    // 4. Resumo final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMO FINAL');
    console.log('='.repeat(50));
    console.log(`✓ Usuários processados: ${results.users}`);
    console.log(`✓ Total de prompts importados: ${results.totalPrompts}`);
    console.log(`⏭️ Prompts já existentes (ignorados): ${results.totalSkipped}`);
    if (results.totalErrors > 0) {
        console.log(`❌ Erros: ${results.totalErrors}`);
    }
    console.log('\n✅ Importação concluída!\n');
}

main().catch(err => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
