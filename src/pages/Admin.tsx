import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, MapPin, Plus, Edit, Trash2, Save, X, Users, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  visitedSpots: string[];
}

const Admin = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' });
  const [newSpot, setNewSpot] = useState({ title: '', categoryId: '', description: '', rating: 5, image: '' });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' as 'admin' | 'user' });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (userRole !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    // Carregar dados do localStorage
    const savedCategories = localStorage.getItem('categories');
    const savedSpots = localStorage.getItem('spots');
    const savedUsers = localStorage.getItem('users');

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Categorias padrão
      const defaultCategories = [
        { id: '1', name: 'Praias', icon: '🏖️' },
        { id: '2', name: 'Restaurantes', icon: '🍽️' },
        { id: '3', name: 'Compras', icon: '🛍️' },
        { id: '4', name: 'Natureza', icon: '🌿' },
        { id: '5', name: 'Pontos Turísticos', icon: '🌅' },
        { id: '6', name: 'Vida Noturna', icon: '🍹' }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }

    if (savedSpots) {
      setSpots(JSON.parse(savedSpots));
    } else {
      // Spots padrão
      const defaultSpots = [
        { id: '1', title: 'Praia do Segredo', categoryId: '1', description: 'Praia escondida com águas cristalinas e areia branca', rating: 4.9, image: '🏖️' },
        { id: '2', title: 'Restaurante Vista Mar', categoryId: '2', description: 'Frutos do mar frescos com vista panorâmica do oceano', rating: 4.8, image: '🍽️' },
        { id: '3', title: 'Mercado Local', categoryId: '3', description: 'Artesanato local e produtos típicos da região', rating: 4.5, image: '🛍️' },
        { id: '4', title: 'Trilha da Cachoeira', categoryId: '4', description: 'Caminhada leve até uma cachoeira refrescante', rating: 4.6, image: '🌿' },
        { id: '5', title: 'Mirante do Por do Sol', categoryId: '5', description: 'Vista espetacular do pôr do sol sobre a cidade', rating: 4.7, image: '🌅' },
        { id: '6', title: 'Bar do João', categoryId: '6', description: 'Drinks autorais e música ao vivo todas as sextas', rating: 4.4, image: '🍹' }
      ];
      setSpots(defaultSpots);
      localStorage.setItem('spots', JSON.stringify(defaultSpots));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Usuários padrão
      const defaultUsers = [
        { id: '1', username: 'admin', password: 'admin123', role: 'admin' as const, visitedSpots: [] },
        { id: '2', username: 'usuario', password: 'user123', role: 'user' as const, visitedSpots: [] }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('users', JSON.stringify(defaultUsers));
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

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('categories', JSON.stringify(newCategories));
  };

  const saveSpots = (newSpots: TouristSpot[]) => {
    setSpots(newSpots);
    localStorage.setItem('spots', JSON.stringify(newSpots));
  };

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      icon: newCategory.icon || '📍'
    };
    
    saveCategories([...categories, category]);
    setNewCategory({ name: '', icon: '' });
    toast({
      title: "Categoria adicionada",
      description: `Categoria "${category.name}" foi criada com sucesso!`,
    });
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    const updatedSpots = spots.filter(s => s.categoryId !== id);
    
    saveCategories(updatedCategories);
    saveSpots(updatedSpots);
    
    toast({
      title: "Categoria removida",
      description: "Categoria e seus locais foram removidos.",
    });
  };

  const addSpot = () => {
    if (!newSpot.title.trim() || !newSpot.categoryId) return;
    
    const spot: TouristSpot = {
      id: Date.now().toString(),
      title: newSpot.title,
      categoryId: newSpot.categoryId,
      description: newSpot.description,
      rating: newSpot.rating,
      image: newSpot.image || '📍'
    };
    
    saveSpots([...spots, spot]);
    setNewSpot({ title: '', categoryId: '', description: '', rating: 5, image: '' });
    toast({
      title: "Local adicionado",
      description: `Local "${spot.title}" foi criado com sucesso!`,
    });
  };

  const deleteSpot = (id: string) => {
    const updatedSpots = spots.filter(s => s.id !== id);
    saveSpots(updatedSpots);
    toast({
      title: "Local removido",
      description: "Local foi removido com sucesso.",
    });
  };

  const addUser = () => {
    if (!newUser.username.trim() || !newUser.password.trim()) return;
    
    // Check if username already exists
    if (users.find(u => u.username === newUser.username)) {
      toast({
        title: "Erro",
        description: "Nome de usuário já existe!",
        variant: "destructive"
      });
      return;
    }
    
    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
      visitedSpots: []
    };
    
    saveUsers([...users, user]);
    setNewUser({ username: '', password: '', role: 'user' });
    toast({
      title: "Usuário criado",
      description: `Usuário "${user.username}" foi criado com sucesso!`,
    });
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(u => u.id !== id);
    saveUsers(updatedUsers);
    toast({
      title: "Usuário removido",
      description: "Usuário foi removido com sucesso.",
    });
  };

  const resetUserPassword = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, password: 'novasenha123' } : u
    );
    saveUsers(updatedUsers);
    toast({
      title: "Senha redefinida",
      description: "Nova senha: novasenha123",
    });
  };

  const viewUserDashboard = (user: User) => {
    // Temporarily set user context for viewing
    localStorage.setItem('viewingUser', JSON.stringify(user));
    navigate('/dashboard?view=admin');
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
              <h1 className="text-xl font-bold text-gray-900">Você em Maceió - Administração</h1>
              <p className="text-sm text-gray-600">Gerenciar usuários, categorias e locais</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
            >
              Ver Dashboard
            </Button>
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="spots">Locais</TabsTrigger>
          </TabsList>
          
          {/* Gerenciar Usuários */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Gerenciar Usuários</span>
                </CardTitle>
                <CardDescription>
                  Criar, visualizar e gerenciar usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="user-username">Nome de Usuário</Label>
                    <Input
                      id="user-username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="Ex: joao"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-password">Senha</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Senha"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-role">Função</Label>
                    <select
                      id="user-role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addUser} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Usuário
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <div>
                            <h4 className="font-medium">{user.username}</h4>
                            <p className="text-sm text-gray-600">
                              {user.role === 'admin' ? 'Administrador' : 'Usuário'} • 
                              {user.visitedSpots.length} locais visitados
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => viewUserDashboard(user)}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Ver Dashboard</span>
                          </Button>
                          <Button
                            onClick={() => resetUserPassword(user.id)}
                            variant="outline"
                            size="sm"
                          >
                            Redefinir Senha
                          </Button>
                          <Button
                            onClick={() => deleteUser(user.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gerenciar Categorias */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Gerenciar Categorias</span>
                </CardTitle>
                <CardDescription>
                  Adicione e gerencie as categorias de locais turísticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="category-name">Nome da Categoria</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Ex: Praias"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-icon">Ícone (Emoji)</Label>
                    <Input
                      id="category-icon"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                      placeholder="🏖️"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addCategory} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Categoria
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Button
                          onClick={() => deleteCategory(category.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gerenciar Locais */}
          <TabsContent value="spots">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Gerenciar Locais</span>
                </CardTitle>
                <CardDescription>
                  Adicione e gerencie os locais turísticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div>
                    <Label htmlFor="spot-title">Nome do Local</Label>
                    <Input
                      id="spot-title"
                      value={newSpot.title}
                      onChange={(e) => setNewSpot({ ...newSpot, title: e.target.value })}
                      placeholder="Ex: Praia do Segredo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="spot-category">Categoria</Label>
                    <select
                      id="spot-category"
                      value={newSpot.categoryId}
                      onChange={(e) => setNewSpot({ ...newSpot, categoryId: e.target.value })}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="spot-description">Descrição</Label>
                    <Input
                      id="spot-description"
                      value={newSpot.description}
                      onChange={(e) => setNewSpot({ ...newSpot, description: e.target.value })}
                      placeholder="Descrição do local"
                    />
                  </div>
                  <div>
                    <Label htmlFor="spot-rating">Avaliação</Label>
                    <Input
                      id="spot-rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newSpot.rating}
                      onChange={(e) => setNewSpot({ ...newSpot, rating: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addSpot} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Local
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {categories.map((category) => {
                    const categorySpots = spots.filter(spot => spot.categoryId === category.id);
                    if (categorySpots.length === 0) return null;
                    
                    return (
                      <div key={category.id}>
                        <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categorySpots.map((spot) => (
                            <Card key={spot.id} className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xl">{spot.image}</span>
                                  <div>
                                    <h4 className="font-medium">{spot.title}</h4>
                                    <p className="text-sm text-gray-600">⭐ {spot.rating}</p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => deleteSpot(spot.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-700">{spot.description}</p>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
