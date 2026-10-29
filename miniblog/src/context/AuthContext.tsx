import { createContext, useContext, useState, type ReactNode } from 'react';
import { getStoredUser, setStoredUser } from '../storage';

interface AuthValue {
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

// Tài khoản cố định theo đề bài
const VALID_USER = 'admin';
const VALID_PASS = '123456';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(getStoredUser());

  const login = (username: string, password: string) => {
    if (username === VALID_USER && password === VALID_PASS) {
      setUser(username);
      setStoredUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}
