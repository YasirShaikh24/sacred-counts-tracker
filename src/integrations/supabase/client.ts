import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wnnoyxvhyprwicndxhly.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indubm95eHZoeXByd2ljbmR4aGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NDcxNzIsImV4cCI6MjA5ODAyMzE3Mn0.fmIsnrrJA2kHmPhdi0ojY1EUQMoL1yhsIVzyrKkZVT0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});