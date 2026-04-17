-- ================================
-- AyurCare — Supabase Schema
-- Run this in Supabase SQL Editor
-- ================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------
-- PROFILES TABLE
-- ----------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT '',
  age           INTEGER CHECK (age > 0 AND age < 150),
  gender        TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  medical_history TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------
-- HISTORIES TABLE
-- ----------------------
CREATE TABLE IF NOT EXISTS public.histories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  disease     TEXT NOT NULL,
  disease_id  TEXT NOT NULL,
  symptoms    TEXT[] NOT NULL DEFAULT '{}',
  other_symptoms TEXT,
  severity    TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  duration    INTEGER NOT NULL CHECK (duration > 0),
  remedy      JSONB NOT NULL,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS histories_user_id_idx ON public.histories(user_id);
CREATE INDEX IF NOT EXISTS histories_created_at_idx ON public.histories(created_at DESC);

-- ----------------------
-- SAVED REMEDIES TABLE
-- ----------------------
CREATE TABLE IF NOT EXISTS public.saved_remedies (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  history_id  UUID NOT NULL REFERENCES public.histories(id) ON DELETE CASCADE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, history_id)
);

CREATE INDEX IF NOT EXISTS saved_remedies_user_id_idx ON public.saved_remedies(user_id);

-- ========================
-- ROW LEVEL SECURITY (RLS)
-- ========================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Histories
ALTER TABLE public.histories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own histories"   ON public.histories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own histories" ON public.histories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own histories" ON public.histories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own histories" ON public.histories FOR DELETE USING (auth.uid() = user_id);

-- Saved Remedies
ALTER TABLE public.saved_remedies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their saved remedies"   ON public.saved_remedies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert saved remedies"       ON public.saved_remedies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their saved remedies" ON public.saved_remedies FOR DELETE USING (auth.uid() = user_id);

-- ========================
-- GRANT PERMISSIONS
-- ========================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.histories TO authenticated;
GRANT ALL ON public.saved_remedies TO authenticated;
