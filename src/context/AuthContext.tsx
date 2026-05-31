import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserRole = 'free' | 'premium' | 'admin';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  listen_count_today: number;
  listen_reset_date: string;
}

interface Subscription {
  plan: 'free' | 'monthly' | 'yearly';
  status: string;
  current_period_end: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isAdmin: boolean;
  isPremium: boolean;
  canListen: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  incrementListenCount: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const FREE_DAILY_LIMIT = 5;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setSubscription(null);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const [{ data: profileData }, { data: subData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('subscriptions').select('*').eq('user_id', userId).single(),
      ]);
      setProfile(profileData);
      setSubscription(subData);
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const incrementListenCount = async (): Promise<boolean> => {
    if (!profile || !user) return false;
    if (profile.role === 'premium' || profile.role === 'admin') return true;

    const today = new Date().toISOString().split('T')[0];
    const resetNeeded = profile.listen_reset_date !== today;
    const newCount = resetNeeded ? 1 : profile.listen_count_today + 1;

    if (!resetNeeded && profile.listen_count_today >= FREE_DAILY_LIMIT) return false;

    const { error } = await supabase
      .from('profiles')
      .update({
        listen_count_today: newCount,
        listen_reset_date: today,
      })
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, listen_count_today: newCount, listen_reset_date: today } : prev);
      return true;
    }
    return false;
  };

  const isAdmin = profile?.role === 'admin';
  const isPremium = profile?.role === 'premium' || profile?.role === 'admin';

  const today = new Date().toISOString().split('T')[0];
  const listenCountToday = profile?.listen_reset_date !== today ? 0 : (profile?.listen_count_today ?? 0);
  const canListen = isPremium || listenCountToday < FREE_DAILY_LIMIT;

  return (
    <AuthContext.Provider value={{
      session, user, profile, subscription,
      isAdmin, isPremium, canListen, loading,
      signIn, signUp, signOut,
      incrementListenCount, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
