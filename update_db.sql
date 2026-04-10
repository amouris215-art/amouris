-- 1. Activer l'extension UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. S'assurer que la colonne ID a une valeur par défaut automatique
-- Cela évitera l'erreur 23502 (null value violates not-null constraint)
ALTER TABLE public.categories 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 3. Insérer la catégorie Accessoires
INSERT INTO public.categories (name_ar, name_fr, slug)
VALUES ('إكسسوارات', 'Accessoires', 'accessoires')
ON CONFLICT (slug) DO NOTHING;

-- 4. Nettoyage des utilisateurs de test avec l'ancien domaine
DELETE FROM auth.users 
WHERE email LIKE '%@amouris-user.dz' 
   OR email LIKE '%@amouris.dz'
   OR email LIKE '%@amouris-client.com';

-- 5. Suppression des profils orphelins
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);
