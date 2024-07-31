import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or anonymous key in environment variables');
  }

export const supabase = createClient(supabaseUrl, supabaseKey);