import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_PREFIX } from '@/lib/config';

type User = { id: string; email: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verify: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const ok = await verify();
          if (!ok) {
            setToken(null);
            localStorage.removeItem('auth_token');
          }
        } catch {
          setToken(null);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_PREFIX}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
    if (!res.ok) throw new Error('فشل تسجيل الدخول');
    const data = await res.json();
    const t = data.token as string;
    setToken(t);
    localStorage.setItem('auth_token', t);
    setUser({ id: data.user?.id || 'me', email: data.user?.email || email });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const verify = async () => {
    try {
      const res = await fetch(`${API_PREFIX}/auth/verify`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser({ id: data.user?.id || 'me', email: data.user?.email || '' });
      return true;
    } catch {
      return false;
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, verify }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
