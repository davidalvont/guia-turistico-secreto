
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  visitedSpots: string[];
}

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Carregar usuários do localStorage
    const savedUsers = localStorage.getItem('users');
    let users: User[] = [];
    
    if (savedUsers) {
      users = JSON.parse(savedUsers);
    } else {
      // Usuários padrão se não existir no localStorage
      users = [
        { id: '1', username: 'admin', password: 'admin123', role: 'admin', visitedSpots: [] },
        { id: '2', username: 'usuario', password: 'user123', role: 'user', visitedSpots: [] }
      ];
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Verificar credenciais
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('currentUserId', user.id);
      
      toast({
        title: "Login realizado com sucesso!",
        description: user.role === 'admin' ? "Bem-vindo, Administrador!" : "Bem-vindo!",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Você em Maceió</CardTitle>
          <CardDescription>
            Descubra Maceió como um Local
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-2">Sistema de usuários:</p>
            <p><strong>Admin:</strong> Gerencia usuários, categorias e locais</p>
            <p><strong>Usuário:</strong> Marca locais como visitados</p>
            <p className="mt-2 text-xs text-gray-500">
              Credenciais padrão: admin/admin123 ou usuario/user123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
