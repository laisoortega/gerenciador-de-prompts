/**
 * Traduz mensagens de erro do Supabase Auth para português brasileiro.
 * Usado nas páginas de login, cadastro e reset de senha.
 */

const errorTranslations: Record<string, string> = {
    // Erros de login
    'Invalid login credentials': 'Email ou senha incorretos',
    'invalid_credentials': 'Email ou senha incorretos',

    // Erros de email
    'Email not confirmed': 'Confirme seu email antes de fazer login',
    'email_not_confirmed': 'Confirme seu email antes de fazer login',
    'User not found': 'Usuário não encontrado',

    // Erros de cadastro
    'User already registered': 'Este email já está cadastrado',
    'Email already registered': 'Este email já está cadastrado',
    'A user with this email address has already been registered': 'Este email já está cadastrado',

    // Erros de senha
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Password is too short': 'A senha deve ter pelo menos 6 caracteres',
    'New password should be different from the old password': 'A nova senha deve ser diferente da senha atual',

    // Erros de rate limit
    'For security purposes, you can only request this once every 60 seconds':
        'Por segurança, você só pode fazer esta solicitação a cada 60 segundos',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos e tente novamente',

    // Erros de rede/servidor
    'Network error': 'Erro de conexão. Verifique sua internet',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'Supabase not configured': 'Sistema temporariamente indisponível',

    // Erros de sessão
    'Auth session missing!': 'Sessão expirada. Faça login novamente',
    'Invalid Refresh Token': 'Sessão expirada. Faça login novamente',
    'Refresh Token Not Found': 'Sessão expirada. Faça login novamente',
};

/**
 * Traduz uma mensagem de erro do Supabase para português.
 * Se não encontrar tradução, retorna a mensagem original.
 */
export function translateSupabaseError(message: string): string {
    if (!message) {
        return 'Ocorreu um erro. Tente novamente.';
    }

    // Verifica correspondência exata
    if (errorTranslations[message]) {
        return errorTranslations[message];
    }

    // Verifica correspondência parcial (para mensagens com variações)
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('invalid login')) {
        return 'Email ou senha incorretos';
    }

    if (lowerMessage.includes('email not confirmed')) {
        return 'Confirme seu email antes de fazer login';
    }

    if (lowerMessage.includes('already registered') || lowerMessage.includes('already been registered')) {
        return 'Este email já está cadastrado';
    }

    if (lowerMessage.includes('rate limit')) {
        return 'Muitas tentativas. Aguarde alguns minutos e tente novamente';
    }

    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
        return 'Erro de conexão. Verifique sua internet';
    }

    if (lowerMessage.includes('session') || lowerMessage.includes('token')) {
        return 'Sessão expirada. Faça login novamente';
    }

    // Se não encontrar tradução, retorna mensagem genérica para evitar expor detalhes técnicos
    console.warn('[translateSupabaseError] Mensagem não traduzida:', message);
    return 'Ocorreu um erro. Tente novamente.';
}
