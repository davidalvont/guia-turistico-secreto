
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, MapPin, Star, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface TouristSpot {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  rating: number;
  image: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [visitedSpots, setVisitedSpots] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Verificar se é admin
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'admin');
    
    // Carregar spots visitados do localStorage
    const savedVisited = localStorage.getItem('visitedSpots');
    if (savedVisited) {
      setVisitedSpots(new Set(JSON.parse(savedVisited)));
    }

    // Carregar categorias e spots
    const savedCategories = localStorage.getItem('categories');
    const savedSpots = localStorage.getItem('spots');

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    if (savedSpots) {
      setSpots(JSON.parse(savedSpots));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/login');
  };

  const toggleVisited = (spotId: string) => {
    const newVisited = new Set(visitedSpots);
    if (newVisited.has(spotId)) {
      newVisited.delete(spotId);
      toast({
        title: "Removido dos visitados",
        description: "Local marcado como não visitado",
      });
    } else {
      newVisited.add(spotId);
      toast({
        title: "Marcado como visitado!",
        description: "Parabéns por conhecer este lugar!",
      });
    }
    setVisitedSpots(newVisited);
    localStorage.setItem('visitedSpots', JSON.stringify(Array.from(newVisited)));
  };

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Você em Maceió</h1>
              <p className="text-sm text-gray-600">Descubra Maceió como um Local</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Administração</span>
              </Button>
            )}
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{visitedSpots.size}</p>
                    <p className="text-sm text-gray-600">Lugares visitados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{spots.length}</p>
                    <p className="text-sm text-gray-600">Total de lugares</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {spots.length > 0 ? Math.round((visitedSpots.size / spots.length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Progresso</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Acesso Rápido */}
        {categories.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Acesso Rápido</span>
              </CardTitle>
              <CardDescription>
                Clique para ir diretamente à categoria desejada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const categorySpots = spots.filter(spot => spot.categoryId === category.id);
                  if (categorySpots.length === 0) return null;
                  
                  return (
                    <Card 
                      key={category.id}
                      className="cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200"
                      onClick={() => scrollToCategory(category.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {categorySpots.length} {categorySpots.length === 1 ? 'local' : 'locais'}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tourist Spots por Categoria */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categorySpots = spots.filter(spot => spot.categoryId === category.id);
            if (categorySpots.length === 0) return null;

            return (
              <div key={category.id} id={`category-${category.id}`}>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySpots.map((spot) => {
                    const isVisited = visitedSpots.has(spot.id);
                    return (
                      <Card 
                        key={spot.id} 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                          isVisited 
                            ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-green-100' 
                            : 'hover:shadow-xl'
                        }`}
                        onClick={() => toggleVisited(spot.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="text-2xl">{spot.image}</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{spot.rating}</span>
                              <span className="text-xs text-gray-500 ml-1">Avaliação no Google</span>
                            </div>
                          </div>
                          <CardTitle className={`text-lg ${isVisited ? 'text-green-800' : ''}`}>
                            {spot.title}
                            {isVisited && <span className="ml-2 text-green-600">✓</span>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-sm ${isVisited ? 'text-green-700' : 'text-gray-600'}`}>
                            {spot.description}
                          </p>
                          <div className="mt-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              isVisited 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isVisited ? 'Visitado' : 'Clique para marcar como visitado'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {categories.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
              <p className="text-gray-600 mb-4">Aguarde enquanto os administradores adicionam conteúdo.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
