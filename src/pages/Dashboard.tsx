import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, MapPin, Star, Settings, Eye, ExternalLink, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import BackToTopButton from '@/components/BackToTopButton';
import { Category, TouristSpot, User } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visitedSpots, setVisitedSpots] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminViewing, setIsAdminViewing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Verificar se é admin
    const userRole = localStorage.getItem('userRole');
    const isAdminUser = userRole === 'admin';
    setIsAdmin(isAdminUser);
    
    // Verificar se admin está visualizando dashboard de usuário
    const isAdminViewMode = location.search.includes('view=admin');
    const viewingUser = localStorage.getItem('viewingUser');
    
    if (isAdminViewMode && viewingUser && isAdminUser) {
      const user = JSON.parse(viewingUser);
      setCurrentUser(user);
      setIsAdminViewing(true);
      setVisitedSpots(new Set(user.visitedSpots));
      localStorage.removeItem('viewingUser'); // Limpar após usar
    } else {
      // Modo normal - carregar dados do usuário atual
      setIsAdminViewing(false);
      const savedVisited = localStorage.getItem('visitedSpots');
      if (savedVisited) {
        setVisitedSpots(new Set(JSON.parse(savedVisited)));
      }
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
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('viewingUser');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/login');
  };

  const toggleVisited = (spotId: string) => {
    // Só permite marcar/desmarcar se não for admin visualizando
    if (isAdminViewing) {
      toast({
        title: "Ação não permitida",
        description: "Administradores não podem marcar locais como visitados para outros usuários.",
        variant: "destructive"
      });
      return;
    }

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

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
              <h1 className="text-xl font-bold text-gray-900">
                Você em Maceió
                {isAdminViewing && currentUser && (
                  <span className="text-sm text-orange-600 ml-2">
                    (Visualizando como: {currentUser.username})
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-600">
                {isAdminViewing ? 'Visualização administrativa' : 'Descubra Maceió como um Local'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAdminViewing && (
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Voltar para Admin</span>
              </Button>
            )}
            {isAdmin && !isAdminViewing && (
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

      {/* Alert for admin viewing mode */}
      {isAdminViewing && (
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <Eye className="h-5 w-5 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  Você está visualizando o dashboard como administrador. Não é possível marcar locais como visitados neste modo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    const hasLinks = spot.googleMapsLink || spot.socialMediaLink || spot.whatsappLink;
                    
                    return (
                      <Card 
                        key={spot.id} 
                        className={`transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                          isVisited 
                            ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-green-100' 
                            : 'hover:shadow-xl'
                        }`}
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
                          <p className={`text-sm mb-3 ${isVisited ? 'text-green-700' : 'text-gray-600'}`}>
                            {spot.description}
                          </p>
                          
                          {/* Links externos */}
                          {hasLinks && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {spot.googleMapsLink && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExternalLink(spot.googleMapsLink!)}
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                                >
                                  <MapPin className="w-3 h-3" />
                                  <span>Maps</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                              {spot.socialMediaLink && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExternalLink(spot.socialMediaLink!)}
                                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                                >
                                  <Star className="w-3 h-3" />
                                  <span>Social</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                              {spot.whatsappLink && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExternalLink(spot.whatsappLink!)}
                                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          )}
                          
                          {/* Botão para marcar como visitado */}
                          <div className="mt-3">
                            <Button
                              onClick={() => toggleVisited(spot.id)}
                              variant={isVisited ? "default" : "outline"}
                              size="sm"
                              disabled={isAdminViewing}
                              className={`w-full ${
                                isVisited 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : isAdminViewing 
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'hover:bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {isVisited 
                                ? 'Visitado ✓' 
                                : isAdminViewing 
                                  ? 'Visualização apenas' 
                                  : 'Marcar como visitado'
                              }
                            </Button>
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

      {/* Botão voltar ao topo */}
      <BackToTopButton />
    </div>
  );
};

export default Dashboard;
