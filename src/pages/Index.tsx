
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Compass, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Você em Maceió
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubra Maceió como um local. Explore os melhores lugares, restaurantes e experiências que a cidade tem a oferecer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/auth">Começar Agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle>Explore com Conhecimento Local</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Descubra lugares autênticos e dicas que só os locais conhecem. Vá além dos pontos turísticos óbvios.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Avaliações Confiáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Todas as recomendações são baseadas em experiências reais e avaliações do Google Maps.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Acompanhe seu Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Marque os lugares que visitou e acompanhe sua jornada explorando Maceió.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Pronto para explorar?</CardTitle>
              <CardDescription className="text-blue-100">
                Junte-se a nós e descubra Maceió de uma forma completamente nova.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/auth">Criar Conta Grátis</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
