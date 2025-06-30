
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, MapPin, Star, Settings, Eye, ExternalLink, MessageCircle, BookOpen, Globe, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import BackToTopButton from '@/components/BackToTopButton';
import { Category, TouristSpot, Lesson, Profile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [visitedSpots, setVisitedSpots] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminViewing, setIsAdminViewing] = useState(false);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      setProfile(profileData);
      setIsAdmin(profileData.role === 'admin');

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Load tourist spots
      const { data: spotsData, error: spotsError } = await supabase
        .from('tourist_spots')
        .select('*')
        .order('title');

      if (spotsError) throw spotsError;
      setSpots(spotsData || []);

      // Load lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Load visited spots
      const { data: visitedData, error: visitedError } = await supabase
        .from('visited_spots')
        .select('spot_id')
        .eq('user_id', user.id);

      if (visitedError) throw visitedError;
      setVisitedSpots(new Set(visitedData?.map(v => v.spot_id) || []));

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/');
  };

  const toggleVisited = async (spotId: string) => {
    if (!user || isAdminViewing) {
      toast({
        title: "Ação não permitida",
        description: "Você precisa estar logado para marcar locais como visitados.",
        variant: "destructive"
      });
      return;
    }

    const isCurrentlyVisited = visitedSpots.has(spotId);
    
    try {
      if (isCurrentlyVisited) {
        // Remove from visited
        const { error } = await supabase
          .from('visited_spots')
          .delete()
          .match({ user_id: user.id, spot_id: spotId });

        if (error) throw error;

        const newVisited = new Set(visitedSpots);
        newVisited.delete(spotId);
        setVisitedSpots(newVisited);
        
        toast({
          title: "Removido dos visitados",
          description: "Local marcado como não visitado",
        });
      } else {
        // Add to visited
        const { error } = await supabase
          .from('visited_spots')
          .insert({ user_id: user.id, spot_id: spotId });

        if (error) throw error;

        const newVisited = new Set(visitedSpots);
        newVisited.add(spotId);
        setVisitedSpots(newVisited);
        
        toast({
          title: "Marcado como visitado!",
          description: "Parabéns por conhecer este lugar!",
        });
      }
    } catch (error) {
      console.error('Error toggling visited spot:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do local.",
        variant: "destructive"
      });
    }
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

  const handleLessonsClick = () => {
    navigate('/lessons');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header - Fixado */}
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Você em Maceió
                  {profile && (
                    <span className="text-sm text-gray-600 ml-2">
                      (Olá, {profile.username}!)
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600">
                  Descubra Maceió como um Local
                </p>
              </div>
              {/* Botão de Aulas Importantes */}
              {lessons.length > 0 && (
                <Button
                  onClick={handleLessonsClick}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Aulas Importantes</span>
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Administração</span>
              </Button>
            )}
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 pt-24">
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
                  const categorySpots = spots.filter(spot => spot.category_id === category.id);
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
            const categorySpots = spots.filter(spot => spot.category_id === category.id);
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
                    const hasLinks = spot.google_maps_link || spot.social_media_link || spot.whatsapp_link || spot.site_link;
                    
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
                              {spot.google_maps_link && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExternalLink(spot.google_maps_link!)}
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                                >
                                  <MapPin className="w-3 h-3" />
                                  <span>Maps</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                              {spot.social_media_link && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExternalLink(spot.social_media_link!)}
                                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                                >
                                  <Star className="w-3 h-3" />
                                  <span>Instagram</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                              {spot.whatsapp_link && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExternalLink(spot.whatsapp_link!)}
                                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                              {spot.site_link && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExternalLink(spot.site_link!)}
                                  className="flex items-center space-x-1 text-orange-600 hover:text-orange-700"
                                >
                                  <Globe className="w-3 h-3" />
                                  <span>Site</span>
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
                              className={`w-full ${
                                isVisited 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : 'hover:bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {isVisited 
                                ? 'Visitado ✓' 
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
