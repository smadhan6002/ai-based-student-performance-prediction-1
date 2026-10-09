import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yyltpzumqijqkjeiroip.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bHRwenVtcWlqcWtqZWlyb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2Njg4MDIsImV4cCI6MjEwNjI0NDgwMn0.jwcKelojKTcYC4yAQYnE738dA_TSHuF5OHyZHW2lWm4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
