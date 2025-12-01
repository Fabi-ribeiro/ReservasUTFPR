import React, { createContext, ReactNode, useContext, useState } from 'react';

// Tipo do usuário da aplicação (dados básicos que vamos guardar em memória)
export type User = {
  uid: string;
  name: string;
  email: string;
  isAdmin?: boolean;
} | null;

// Tipo do contexto
type AuthContextValue = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
};

// Criamos o contexto
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de acesso
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export default AuthProvider;
