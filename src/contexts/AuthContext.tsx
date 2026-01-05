import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { seedPromptsForNewUser } from '../services/seedService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isRecoveryMode: boolean;
    signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
    clearRecoveryMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

    // Ref para ter acesso ao valor atual do user dentro do callback do Supabase
    const userRef = useRef<User | null>(null);
    useEffect(() => { userRef.current = user; }, [user]);

    useEffect(() => {
        if (!supabase) {
            // Mock mode - simulate logged in user
            setUser({ id: 'mock-user-id', email: 'demo@example.com' } as User);
            setIsLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            // Só atualiza estado se realmente houve mudança no usuário
            // Evita re-renders desnecessários quando Supabase dispara eventos ao retornar para aba
            const newUserId = newSession?.user?.id ?? null;
            const currentUserId = userRef.current?.id ?? null;

            if (newUserId !== currentUserId || event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
                setSession(newSession);
                setUser(newSession?.user ?? null);
            }

            // Detect password recovery event
            if (event === 'PASSWORD_RECOVERY') {
                setIsRecoveryMode(true);
            }

            // Seed prompts for new users on first login
            if (event === 'SIGNED_IN' && newSession?.user) {
                // Run seeding in background (don't block login)
                seedPromptsForNewUser(newSession.user.id).catch(err => {
                    console.error('[Auth] Erro no seeding:', err);
                });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const clearRecoveryMode = () => setIsRecoveryMode(false);

    const signUp = async (email: string, password: string, name: string) => {
        if (!supabase) return { error: { message: 'Supabase not configured' } };

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });
        return { error };
    };

    const signIn = async (email: string, password: string) => {
        if (!supabase) return { error: { message: 'Supabase not configured' } };

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { error };
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
    };

    const resetPassword = async (email: string) => {
        if (!supabase) return { error: { message: 'Supabase not configured' } };

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        return { error };
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, isRecoveryMode, signUp, signIn, signOut, resetPassword, clearRecoveryMode }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
