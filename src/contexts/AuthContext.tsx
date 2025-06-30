
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthSession } from '@/types/auth';

interface AuthContextType {
  session: AuthSession | null;
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários padrão (você pode expandir esta lista)
const defaultUsers: AuthUser[] = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin', visitedSpots: [] },
  { id: '2', username: 'usuario', password: 'user123', role: 'user', visitedSpots: [] }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar usuários padrão se não existirem
    const savedUsers = localStorage.getItem('users');
    if (!savedUsers) {
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Verificar se há uma sessão ativa
    const savedSession = localStorage.getItem('authSession');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
    
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const savedUsers = localStorage.getItem('users');
      const users: AuthUser[] = savedUsers ? JSON.parse(savedUsers) : defaultUsers;
      
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        const newSession: AuthSession = {
          user,
          isAuthenticated: true
        };
        
        setSession(newSession);
        localStorage.setItem('authSession', JSON.stringify(newSession));
        
        return { success: true };
      } else {
        return { success: false, error: 'Usuário ou senha incorretos' };
      }
    } catch (error) {
      return { success: false, error: 'Erro interno do sistema' };
    }
  };

  const signOut = () => {
    setSession(null);
    localStorage.removeItem('authSession');
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
