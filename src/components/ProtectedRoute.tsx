
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!session?.isAuthenticated) {
        navigate('/login');
        return;
      }

      if (requireAdmin && session.user.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
    }
  }, [session, loading, navigate, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session?.isAuthenticated) {
    return null;
  }

  if (requireAdmin && session.user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};
