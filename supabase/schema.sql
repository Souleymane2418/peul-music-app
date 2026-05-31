-- ============================================
-- PEUL MUSIC APP — Schéma Supabase
-- ============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles (extension de auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'premium', 'admin')),
  listen_count_today INTEGER DEFAULT 0,
  listen_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: artists
-- ============================================
CREATE TABLE artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  generation TEXT NOT NULL CHECK (generation IN (
    'Traditionnelle', 'Années 60-70', 'Années 80-90', 'Moderne 2000+', 'Contemporaine'
  )),
  bio TEXT,
  image_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  followers INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: albums
-- ============================================
CREATE TABLE albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  cover_url TEXT,
  genre TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: songs
-- ============================================
CREATE TABLE songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE NOT NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  audio_url TEXT,                    -- URL Supabase Storage
  cover_url TEXT,
  duration INTEGER NOT NULL DEFAULT 0, -- secondes
  year INTEGER NOT NULL,
  country TEXT NOT NULL,
  generation TEXT NOT NULL CHECK (generation IN (
    'Traditionnelle', 'Années 60-70', 'Années 80-90', 'Moderne 2000+', 'Contemporaine'
  )),
  genre TEXT NOT NULL,
  language TEXT NOT NULL,            -- Pulaar, Fulfulde, Pular, Fula...
  lyrics TEXT,
  plays INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,  -- true = réservé aux abonnés Premium
  published BOOLEAN DEFAULT FALSE,   -- true = visible par les utilisateurs
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: subscriptions
-- ============================================
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: favorites
-- ============================================
CREATE TABLE favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- ============================================
-- TABLE: play_history
-- ============================================
CREATE TABLE play_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE NOT NULL,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: playlists
-- ============================================
CREATE TABLE playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE playlist_songs (
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (playlist_id, song_id)
);

-- ============================================
-- TRIGGERS: auto-créer profil à l'inscription
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- TRIGGER: reset compteur écoutes quotidien
-- ============================================
CREATE OR REPLACE FUNCTION reset_daily_listen_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.listen_reset_date < CURRENT_DATE THEN
    NEW.listen_count_today := 0;
    NEW.listen_reset_date := CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_listen_reset
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION reset_daily_listen_count();

-- ============================================
-- TRIGGER: incrémenter plays
-- ============================================
CREATE OR REPLACE FUNCTION increment_song_plays()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE songs SET plays = plays + 1 WHERE id = NEW.song_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_song_played
  AFTER INSERT ON play_history
  FOR EACH ROW EXECUTE FUNCTION increment_song_plays();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Profiles: chacun voit son profil, admins voient tout
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Songs: publiées visibles par tous, non publiées par admins seulement
CREATE POLICY "Anyone can view published songs" ON songs FOR SELECT USING (published = TRUE);
CREATE POLICY "Admins can do everything on songs" ON songs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Artists & Albums: même logique
CREATE POLICY "Anyone can view published artists" ON artists FOR SELECT USING (published = TRUE);
CREATE POLICY "Admins can manage artists" ON artists FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can view published albums" ON albums FOR SELECT USING (published = TRUE);
CREATE POLICY "Admins can manage albums" ON albums FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subscriptions: chacun voit la sienne
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Favorites: chacun gère les siennes
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Play history: chacun voit son historique
CREATE POLICY "Users can manage own history" ON play_history FOR ALL USING (auth.uid() = user_id);

-- Playlists
CREATE POLICY "Users can manage own playlists" ON playlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view public playlists" ON playlists FOR SELECT USING (is_public = TRUE);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- À créer dans le dashboard Supabase:
-- 1. "audio" (private) — fichiers MP3
-- 2. "covers" (public) — pochettes d'albums
-- 3. "avatars" (public) — photos de profil

-- ============================================
-- INDEXES pour performance
-- ============================================
CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_songs_album ON songs(album_id);
CREATE INDEX idx_songs_country ON songs(country);
CREATE INDEX idx_songs_generation ON songs(generation);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_songs_published ON songs(published);
CREATE INDEX idx_play_history_user ON play_history(user_id);
CREATE INDEX idx_play_history_song ON play_history(song_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
