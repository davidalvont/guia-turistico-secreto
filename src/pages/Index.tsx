
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Se já estiver autenticado, redireciona para o dashboard
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
          <MapPin className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Guia Turístico
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Descubra lugares incríveis e mantenha o controle dos seus destinos visitados
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/login')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Entrar no Sistema
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <div className="text-sm text-gray-500">
            Acesse com suas credenciais para explorar os destinos
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
