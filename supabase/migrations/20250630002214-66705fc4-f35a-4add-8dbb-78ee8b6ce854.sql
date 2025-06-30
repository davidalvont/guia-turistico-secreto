
-- Criar tabela de categorias
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de pontos turísticos
CREATE TABLE public.tourist_spots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  image TEXT NOT NULL,
  google_maps_link TEXT,
  social_media_link TEXT,
  whatsapp_link TEXT,
  site_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de locais visitados
CREATE TABLE public.visited_spots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  spot_id UUID REFERENCES public.tourist_spots(id) ON DELETE CASCADE NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, spot_id)
);

-- Criar tabela de aulas
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  youtube_link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS) para todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourist_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visited_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias (público para leitura, apenas admin para escrita)
CREATE POLICY "Todos podem ver categorias" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem inserir categorias" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem atualizar categorias" ON public.categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem deletar categorias" ON public.categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para pontos turísticos (público para leitura, apenas admin para escrita)
CREATE POLICY "Todos podem ver pontos turísticos" ON public.tourist_spots
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem inserir pontos turísticos" ON public.tourist_spots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem atualizar pontos turísticos" ON public.tourist_spots
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem deletar pontos turísticos" ON public.tourist_spots
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para perfis (usuários podem ver e atualizar seus próprios perfis)
CREATE POLICY "Usuários podem ver todos os perfis" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem inserir seu próprio perfil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para locais visitados (usuários só podem ver e gerenciar seus próprios)
CREATE POLICY "Usuários podem ver seus locais visitados" ON public.visited_spots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem marcar locais como visitados" ON public.visited_spots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem desmarcar locais visitados" ON public.visited_spots
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para aulas (público para leitura, apenas admin para escrita)
CREATE POLICY "Todos podem ver aulas" ON public.lessons
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem inserir aulas" ON public.lessons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem atualizar aulas" ON public.lessons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem deletar aulas" ON public.lessons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'username', NEW.email), 
    'user'
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Inserir dados iniciais para demonstração
INSERT INTO public.categories (name, icon) VALUES
  ('Praias', '🏖️'),
  ('Restaurantes', '🍽️'),
  ('Pontos Turísticos', '🏛️'),
  ('Vida Noturna', '🌙'),
  ('Compras', '🛍️'),
  ('Cultura', '🎭');

-- Inserir alguns pontos turísticos de exemplo
INSERT INTO public.tourist_spots (title, category_id, description, rating, image, google_maps_link) VALUES
  ('Praia de Pajuçara', (SELECT id FROM public.categories WHERE name = 'Praias'), 'Uma das praias mais famosas de Maceió, conhecida pelas piscinas naturais formadas pelos recifes de coral.', 4.5, '🏖️', 'https://maps.google.com/?q=Praia+de+Pajuçara+Maceió'),
  ('Mercado do Artesanato', (SELECT id FROM public.categories WHERE name = 'Compras'), 'Local perfeito para comprar lembranças e artesanato local de Alagoas.', 4.2, '🛍️', 'https://maps.google.com/?q=Mercado+do+Artesanato+Maceió'),
  ('Teatro Deodoro', (SELECT id FROM public.categories WHERE name = 'Cultura'), 'Teatro histórico no centro de Maceió, importante patrimônio cultural da cidade.', 4.3, '🎭', 'https://maps.google.com/?q=Teatro+Deodoro+Maceió');

-- Inserir uma aula de exemplo
INSERT INTO public.lessons (title, description, youtube_link) VALUES
  ('Como aproveitar melhor Maceió', 'Dicas essenciais para turistas em Maceió: melhores praias, onde comer, como se locomover e dicas de segurança.', 'https://www.youtube.com/watch?v=exemplo');
