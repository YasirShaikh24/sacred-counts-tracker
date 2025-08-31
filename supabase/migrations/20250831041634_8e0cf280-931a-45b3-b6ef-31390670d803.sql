-- Create Quran Shareef tracking table
CREATE TABLE public.quran_shareef (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sipara_number INTEGER NOT NULL CHECK (sipara_number >= 1 AND sipara_number <= 30),
  assigned_person_name TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_date TIMESTAMP WITH TIME ZONE,
  assigned_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sipara_number)
);

-- Enable Row Level Security
ALTER TABLE public.quran_shareef ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (similar to prayer_cards)
CREATE POLICY "Public can read quran shareef" 
ON public.quran_shareef 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert quran shareef" 
ON public.quran_shareef 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update quran shareef" 
ON public.quran_shareef 
FOR UPDATE 
USING (true);

CREATE POLICY "Public can delete quran shareef" 
ON public.quran_shareef 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quran_shareef_updated_at
BEFORE UPDATE ON public.quran_shareef
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for all 30 Siparas
INSERT INTO public.quran_shareef (sipara_number) 
SELECT generate_series(1, 30);