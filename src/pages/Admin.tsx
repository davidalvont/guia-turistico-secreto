import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, MapPin, Plus, Edit, Trash2, Save, X, Users, Eye, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category, TouristSpot, User, Lesson } from '@/types';

const Admin = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' });
  const [newSpot, setNewSpot] = useState({ 
    title: '', 
    categoryId: '', 
    description: '', 
    rating: 5, 
    image: '',
    googleMapsLink: '',
    socialMediaLink: '',
    whatsappLink: '',
    siteLink: ''
  });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' as 'admin' | 'user' });
  const [newLesson, setNewLesson] = useState({ title: '', description: '', youtubeLink: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSpot, setEditingSpot] = useState<TouristSpot | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');

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
    const savedLessons = localStorage.getItem('lessons');

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

    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
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

  const saveLessons = (newLessons: Lesson[]) => {
    setLessons(newLessons);
    localStorage.setItem('lessons', JSON.stringify(newLessons));
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

  const editCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const saveEditCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    
    const updatedCategories = categories.map(c => 
      c.id === editingCategory.id ? editingCategory : c
    );
    saveCategories(updatedCategories);
    setEditingCategory(null);
    toast({
      title: "Categoria atualizada",
      description: "Categoria foi editada com sucesso!",
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
      image: newSpot.image || '📍',
      googleMapsLink: newSpot.googleMapsLink || undefined,
      socialMediaLink: newSpot.socialMediaLink || undefined,
      whatsappLink: newSpot.whatsappLink || undefined,
      siteLink: newSpot.siteLink || undefined
    };
    
    saveSpots([...spots, spot]);
    setNewSpot({ 
      title: '', 
      categoryId: '', 
      description: '', 
      rating: 5, 
      image: '',
      googleMapsLink: '',
      socialMediaLink: '',
      whatsappLink: '',
      siteLink: ''
    });
    toast({
      title: "Local adicionado",
      description: `Local "${spot.title}" foi criado com sucesso!`,
    });
  };

  const editSpot = (spot: TouristSpot) => {
    setEditingSpot(spot);
  };

  const saveEditSpot = () => {
    if (!editingSpot || !editingSpot.title.trim() || !editingSpot.categoryId) return;
    
    const updatedSpots = spots.map(s => 
      s.id === editingSpot.id ? {
        ...editingSpot,
        googleMapsLink: editingSpot.googleMapsLink || undefined,
        socialMediaLink: editingSpot.socialMediaLink || undefined,
        whatsappLink: editingSpot.whatsappLink || undefined,
        siteLink: editingSpot.siteLink || undefined
      } : s
    );
    saveSpots(updatedSpots);
    setEditingSpot(null);
    toast({
      title: "Local atualizado",
      description: "Local foi editado com sucesso!",
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
    if (!newPassword.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma nova senha!",
        variant: "destructive"
      });
      return;
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, password: newPassword } : u
    );
    saveUsers(updatedUsers);
    setResetPasswordUserId('');
    setNewPassword('');
    toast({
      title: "Senha redefinida",
      description: `Nova senha definida com sucesso!`,
    });
  };

  const viewUserDashboard = (user: User) => {
    // Temporarily set user context for viewing
    localStorage.setItem('viewingUser', JSON.stringify(user));
    navigate('/dashboard?view=admin');
  };

  // Lesson functions
  const addLesson = () => {
    if (!newLesson.title.trim() || !newLesson.youtubeLink.trim()) return;
    
    const lesson: Lesson = {
      id: Date.now().toString(),
      title: newLesson.title,
      description: newLesson.description,
      youtubeLink: newLesson.youtubeLink
    };
    
    saveLessons([...lessons, lesson]);
    setNewLesson({ title: '', description: '', youtubeLink: '' });
    toast({
      title: "Aula adicionada",
      description: `Aula "${lesson.title}" foi criada com sucesso!`,
    });
  };

  const editLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
  };

  const saveEditLesson = () => {
    if (!editingLesson || !editingLesson.title.trim() || !editingLesson.youtubeLink.trim()) return;
    
    const updatedLessons = lessons.map(l => 
      l.id === editingLesson.id ? editingLesson : l
    );
    saveLessons(updatedLessons);
    setEditingLesson(null);
    toast({
      title: "Aula atualizada",
      description: "Aula foi editada com sucesso!",
    });
  };

  const deleteLesson = (id: string) => {
    const updatedLessons = lessons.filter(l => l.id !== id);
    saveLessons(updatedLessons);
    toast({
      title: "Aula removida",
      description: "Aula foi removida com sucesso.",
    });
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
              <p className="text-sm text-gray-600">Gerenciar usuários, categorias, locais e aulas</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="spots">Locais</TabsTrigger>
            <TabsTrigger value="lessons">Aulas</TabsTrigger>
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
                              {user.visitedSpots?.length || 0} locais visitados
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
                          {resetPasswordUserId === user.id ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nova senha"
                                className="w-32"
                              />
                              <Button
                                onClick={() => resetUserPassword(user.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  setResetPasswordUserId('');
                                  setNewPassword('');
                                }}
                                variant="outline"
                                size="sm"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => setResetPasswordUserId(user.id)}
                              variant="outline"
                              size="sm"
                            >
                              Redefinir Senha
                            </Button>
                          )}
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
                      {editingCategory?.id === category.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            placeholder="Nome da categoria"
                          />
                          <Input
                            value={editingCategory.icon}
                            onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                            placeholder="🏖️"
                          />
                          <div className="flex space-x-2">
                            <Button onClick={saveEditCategory} size="sm" className="flex-1">
                              <Save className="w-4 h-4 mr-1" />
                              Salvar
                            </Button>
                            <Button onClick={() => setEditingCategory(null)} variant="outline" size="sm">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              onClick={() => editCategory(category)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteCategory(category.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Informações Básicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Links (Opcionais)</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="spot-maps">Link do Google Maps</Label>
                        <Input
                          id="spot-maps"
                          value={newSpot.googleMapsLink}
                          onChange={(e) => setNewSpot({ ...newSpot, googleMapsLink: e.target.value })}
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="spot-social">Link do Instagram</Label>
                        <Input
                          id="spot-social"
                          value={newSpot.socialMediaLink}
                          onChange={(e) => setNewSpot({ ...newSpot, socialMediaLink: e.target.value })}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="spot-whatsapp">Link do WhatsApp</Label>
                        <Input
                          id="spot-whatsapp"
                          value={newSpot.whatsappLink}
                          onChange={(e) => setNewSpot({ ...newSpot, whatsappLink: e.target.value })}
                          placeholder="https://wa.me/..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="spot-site">Link do Site</Label>
                        <Input
                          id="spot-site"
                          value={newSpot.siteLink}
                          onChange={(e) => setNewSpot({ ...newSpot, siteLink: e.target.value })}
                          placeholder="https://exemplo.com..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button onClick={addSpot} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Local
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  {categories.map((category) => {
                    const categorySpots = spots.filter(spot => spot.categoryId === category.id);
                    if (categorySpots.length === 0) return null;
                    
                    return (
                      <div key={category.id}>
                        <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categorySpots.map((spot) => (
                            <Card key={spot.id} className="p-4">
                              {editingSpot?.id === spot.id ? (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input
                                      value={editingSpot.title}
                                      onChange={(e) => setEditingSpot({ ...editingSpot, title: e.target.value })}
                                      placeholder="Nome do local"
                                    />
                                    <select
                                      value={editingSpot.categoryId}
                                      onChange={(e) => setEditingSpot({ ...editingSpot, categoryId: e.target.value })}
                                      className="h-10 px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                      {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                          {cat.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <Input
                                    value={editingSpot.description}
                                    onChange={(e) => setEditingSpot({ ...editingSpot, description: e.target.value })}
                                    placeholder="Descrição"
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input
                                      type="number"
                                      min="1"
                                      max="5"
                                      step="0.1"
                                      value={editingSpot.rating}
                                      onChange={(e) => setEditingSpot({ ...editingSpot, rating: parseFloat(e.target.value) })}
                                    />
                                    <Input
                                      value={editingSpot.image}
                                      onChange={(e) => setEditingSpot({ ...editingSpot, image: e.target.value })}
                                      placeholder="Emoji"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      value={editingSpot.googleMapsLink || ''}
                                      onChange={(e) => setEditingSpot({ ...editingSpot, googleMapsLink: e.target.value })}
                                      placeholder="Link Google Maps"
                                    />
                                    <Input
                                      value={editingSpot.socialMediaLink || ''}
                                      onChange={(e) => setEditingSpot({ ...editingSpot, socialMediaLink: e.target.value })}
                                      placeholder="Link Instagram"
                                    />
                                    <Input
                                      value={editingSpot.whatsappLink || ''}
                                      onChange={(e) => setEditingSpot({ ...editingSpot, whatsappLink: e.target.value })}
                                      placeholder="Link WhatsApp"
                                    />
                                    <Input
                                      value={editingSpot.siteLink || ''}
                                      onChange={(e) => setEditingSpot({ ...editingSpot, siteLink: e.target.value })}
                                      placeholder="Link Site"
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button onClick={saveEditSpot} size="sm" className="flex-1">
                                      <Save className="w-4 h-4 mr-1" />
                                      Salvar
                                    </Button>
                                    <Button onClick={() => setEditingSpot(null)} variant="outline" size="sm">
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xl">{spot.image}</span>
                                      <div>
                                        <h4 className="font-medium">{spot.title}</h4>
                                        <p className="text-sm text-gray-600">⭐ {spot.rating}</p>
                                      </div>
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button
                                        onClick={() => editSpot(spot)}
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 hover:text-blue-700"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        onClick={() => deleteSpot(spot.id)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">{spot.description}</p>
                                  {(spot.googleMapsLink || spot.socialMediaLink || spot.whatsappLink || spot.siteLink) && (
                                    <div className="flex flex-wrap gap-1 text-xs">
                                      {spot.googleMapsLink && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">📍 Maps</span>}
                                      {spot.socialMediaLink && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">📱 Instagram</span>}
                                      {spot.whatsappLink && <span className="bg-green-100 text-green-700 px-2 py-1 rounded">💬 WhatsApp</span>}
                                      {spot.siteLink && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">🌐 Site</span>}
                                    </div>
                                  )}
                                </>
                              )}
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

          {/* Gerenciar Aulas */}
          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Gerenciar Aulas</span>
                </CardTitle>
                <CardDescription>
                  Adicione e gerencie aulas educativas do YouTube
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="lesson-title">Título da Aula</Label>
                    <Input
                      id="lesson-title"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      placeholder="Ex: Como usar o sistema"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lesson-description">Descrição</Label>
                    <Input
                      id="lesson-description"
                      value={newLesson.description}
                      onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                      placeholder="Breve descrição da aula"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lesson-youtube">Link do YouTube</Label>
                    <Input
                      id="lesson-youtube"
                      value={newLesson.youtubeLink}
                      onChange={(e) => setNewLesson({ ...newLesson, youtubeLink: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-center mb-6">
                  <Button onClick={addLesson} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Aula
                  </Button>
                </div>

                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <Card key={lesson.id} className="p-4">
                      {editingLesson?.id === lesson.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editingLesson.title}
                            onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                            placeholder="Título da aula"
                          />
                          <Input
                            value={editingLesson.description}
                            onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                            placeholder="Descrição"
                          />
                          <Input
                            value={editingLesson.youtubeLink}
                            onChange={(e) => setEditingLesson({ ...editingLesson, youtubeLink: e.target.value })}
                            placeholder="Link do YouTube"
                          />
                          <div className="flex space-x-2">
                            <Button onClick={saveEditLesson} size="sm" className="flex-1">
                              <Save className="w-4 h-4 mr-1" />
                              Salvar
                            </Button>
                            <Button onClick={() => setEditingLesson(null)} variant="outline" size="sm">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="w-8 h-8 text-red-600" />
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                              <a
                                href={lesson.youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline truncate block max-w-xs"
                              >
                                {lesson.youtubeLink}
                              </a>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              onClick={() => editLesson(lesson)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteLesson(lesson.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                  
                  {lessons.length === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Nenhuma aula adicionada ainda</p>
                      <p className="text-sm text-gray-500">Adicione aulas do YouTube para ajudar os usuários</p>
                    </div>
                  )}
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
