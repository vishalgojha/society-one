import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  operatorId: 'activeOperatorId',
  societyId: 'activeSocietyId',
  role: 'activeRole',
  propertyId: 'activePropertyId',
};

async function loadOperator(userId) {
  const { data, error } = await supabase
    .from('operators')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [operator, setOperator] = useState(null);
  const [role, setRole] = useState(null);
  const [societyId, setSocietyId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSession = useCallback(async (session) => {
    const nextUser = session?.user ?? null;
    setUser(nextUser);

    if (!nextUser) {
      setOperator(null);
      setRole(null);
      setSocietyId(null);
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      setIsLoading(false);
      return;
    }

    try {
      const operatorRecord = await loadOperator(nextUser.id);
      setOperator(operatorRecord);
      setRole(operatorRecord?.role ?? null);
      setSocietyId(operatorRecord?.society_id ?? null);

      if (operatorRecord?.id) localStorage.setItem(STORAGE_KEYS.operatorId, operatorRecord.id);
      if (operatorRecord?.society_id) localStorage.setItem(STORAGE_KEYS.societyId, operatorRecord.society_id);
      if (operatorRecord?.role) localStorage.setItem(STORAGE_KEYS.role, operatorRecord.role);
      if (operatorRecord?.property_id) localStorage.setItem(STORAGE_KEYS.propertyId, operatorRecord.property_id);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        syncSession(data.session).catch(() => setIsLoading(false));
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session).catch(() => setIsLoading(false));
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [syncSession]);

  const login = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/OperatorAuth`,
      },
    });

    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(() => ({
    user,
    operator,
    role,
    societyId,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  }), [user, operator, role, societyId, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
