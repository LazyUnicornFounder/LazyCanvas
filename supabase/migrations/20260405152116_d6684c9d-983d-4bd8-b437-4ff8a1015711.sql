-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles: only admins can read
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create slideshow_quotes table
CREATE TABLE public.slideshow_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT DEFAULT '',
  author_photo_url TEXT,
  socials TEXT DEFAULT '',
  social_platform TEXT DEFAULT 'instagram',
  website TEXT DEFAULT '',
  font TEXT DEFAULT 'playfair',
  theme TEXT DEFAULT 'dark',
  background_image_url TEXT,
  background_opacity NUMERIC DEFAULT 0.4,
  background_color TEXT DEFAULT '',
  font_size NUMERIC DEFAULT 1.4,
  text_align TEXT DEFAULT 'center',
  letter_spacing NUMERIC DEFAULT 0,
  line_height NUMERIC DEFAULT 1.6,
  text_color TEXT DEFAULT '',
  author_font_size NUMERIC DEFAULT 0.875,
  author_color TEXT DEFAULT '',
  author_font TEXT DEFAULT 'playfair',
  text_shadow TEXT DEFAULT 'none',
  author_position TEXT DEFAULT 'below-quote',
  is_bold BOOLEAN DEFAULT false,
  is_italic BOOLEAN DEFAULT false,
  aspect_ratio TEXT DEFAULT 'square',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.slideshow_quotes ENABLE ROW LEVEL SECURITY;

-- Anyone can read slideshow quotes (for the public hero slideshow)
CREATE POLICY "Anyone can view slideshow quotes"
  ON public.slideshow_quotes FOR SELECT
  USING (true);

-- Only admins can insert
CREATE POLICY "Admins can create slideshow quotes"
  ON public.slideshow_quotes FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update slideshow quotes"
  ON public.slideshow_quotes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete slideshow quotes"
  ON public.slideshow_quotes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_slideshow_quotes_updated_at
  BEFORE UPDATE ON public.slideshow_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();