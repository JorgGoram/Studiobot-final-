
-- Enable RLS on tables
ALTER TABLE public.webhook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forest_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_events ENABLE ROW LEVEL SECURITY;

-- Create policies for webhook table
CREATE POLICY "Users can view their own webhooks" 
ON public.webhook FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for badges table
CREATE POLICY "Users can view their own badges" 
ON public.badges FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for forest_trees table
CREATE POLICY "Users can view their own trees" 
ON public.forest_trees FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for seasonal_events table
CREATE POLICY "Users can view all seasonal events" 
ON public.seasonal_events FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can modify seasonal events" 
ON public.seasonal_events FOR ALL 
USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));
