import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            // Detect password recovery event
            if (event === 'PASSWORD_RECOVERY') {
                setIsRecoveryMode(true);
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
