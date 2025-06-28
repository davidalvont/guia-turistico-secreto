
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, MapPin, Utensils, Waves, Camera, ShoppingBag, TreePalm, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TouristSpot {
  id: string;
  title: string;
  category: string;
  description: string;
  rating: number;
  visited: boolean;
  image: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [visitedSpots, setVisitedSpots] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Carregar spots visitados do localStorage
    const savedVisited = localStorage.getItem('visitedSpots');
    if (savedVisited) {
      setVisitedSpots(new Set(JSON.parse(savedVisited)));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
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

  const touristSpots: TouristSpot[] = [
    {
      id: '1',
      title: 'Restaurante Vista Mar',
      category: 'Restaurantes',
      description: 'Frutos do mar frescos com vista panorâmica do oceano',
      rating: 4.8,
      visited: false,
      image: '🍽️'
    },
    {
      id: '2',
      title: 'Praia do Segredo',
      category: 'Praias',
      description: 'Praia escondida com águas cristalinas e areia branca',
      rating: 4.9,
      visited: false,
      image: '🏖️'
    },
    {
      id: '3',
      title: 'Mirante do Por do Sol',
      category: 'Pontos Turísticos',
      description: 'Vista espetacular do pôr do sol sobre a cidade',
      rating: 4.7,
      visited: false,
      image: '🌅'
    },
    {
      id: '4',
      title: 'Mercado Local',
      category: 'Compras',
      description: 'Artesanato local e produtos típicos da região',
      rating: 4.5,
      visited: false,
      image: '🛍️'
    },
    {
      id: '5',
      title: 'Trilha da Cachoeira',
      category: 'Natureza',
      description: 'Caminhada leve até uma cachoeira refrescante',
      rating: 4.6,
      visited: false,
      image: '🌿'
    },
    {
      id: '6',
      title: 'Bar do João',
      category: 'Vida Noturna',
      description: 'Drinks autorais e música ao vivo todas as sextas',
      rating: 4.4,
      visited: false,
      image: '🍹'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Restaurantes': return <Utensils className="w-5 h-5" />;
      case 'Praias': return <Waves className="w-5 h-5" />;
      case 'Pontos Turísticos': return <Camera className="w-5 h-5" />;
      case 'Compras': return <ShoppingBag className="w-5 h-5" />;
      case 'Natureza': return <TreePalm className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
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
              <h1 className="text-xl font-bold text-gray-900">Guia Turístico</h1>
              <p className="text-sm text-gray-600">Explore lugares incríveis</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </Button>
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
                    <p className="text-2xl font-bold text-blue-600">{touristSpots.length}</p>
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
                      {Math.round((visitedSpots.size / touristSpots.length) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600">Progresso</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tourist Spots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {touristSpots.map((spot) => {
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
                      {getCategoryIcon(spot.category)}
                      <div className="text-2xl">{spot.image}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{spot.rating}</span>
                    </div>
                  </div>
                  <CardTitle className={`text-lg ${isVisited ? 'text-green-800' : ''}`}>
                    {spot.title}
                    {isVisited && <span className="ml-2 text-green-600">✓</span>}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500 uppercase tracking-wide">
                    {spot.category}
                  </CardDescription>
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
      </main>
    </div>
  );
};

export default Dashboard;
