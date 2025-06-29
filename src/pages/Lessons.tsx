
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Play, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Lesson } from '@/types';

const Lessons = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    // Verificar se está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Carregar aulas do localStorage
    const savedLessons = localStorage.getItem('lessons');
    if (savedLessons) {
      const lessonsData = JSON.parse(savedLessons);
      setLessons(lessonsData);
      // Selecionar primeira aula automaticamente se existir
      if (lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    }
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const getYouTubeEmbedUrl = (youtubeLink: string) => {
    // Converter link do YouTube para formato embed
    const videoId = youtubeLink.split('v=')[1]?.split('&')[0] || 
                   youtubeLink.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header - Sempre visível */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">O que você precisa Saber</h1>
              <p className="text-sm text-gray-600">Aprenda sobre Maceió</p>
            </div>
          </div>
          <Button 
            onClick={handleBackToDashboard}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar ao Dashboard</span>
            <span className="sm:hidden">Voltar</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma aula disponível</h3>
            <p className="text-gray-600 mb-4">As aulas serão adicionadas pelos administradores em breve.</p>
            <Button onClick={handleBackToDashboard} variant="outline">
              Voltar ao Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Lista de Aulas */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Aulas Importantes</span>
                  </CardTitle>
                  <CardDescription>
                    Selecione uma aula para assistir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <Button
                      key={lesson.id}
                      variant={selectedLesson?.id === lesson.id ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0">
                          <Play className="w-4 h-4 mt-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">Aula {index + 1}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Player de Vídeo */}
            <div className="lg:col-span-3">
              {selectedLesson ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>{selectedLesson.title}</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedLesson.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {getYouTubeEmbedUrl(selectedLesson.youtubeLink) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(selectedLesson.youtubeLink)}
                          title={selectedLesson.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Link de vídeo inválido</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Descrição detalhada */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Sobre esta aula</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedLesson.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma aula</h3>
                      <p className="text-gray-600">
                        Escolha uma aula da lista ao lado para começar a assistir.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Lessons;
