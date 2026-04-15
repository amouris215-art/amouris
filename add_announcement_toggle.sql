-- Add show_announcement_bar to settings table
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS show_announcement_bar BOOLEAN DEFAULT true;

-- Update existing row to have it true by default
UPDATE public.settings 
SET show_announcement_bar = true 
WHERE show_announcement_bar IS NULL;
