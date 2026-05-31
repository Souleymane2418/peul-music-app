import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👉 Remplace ces valeurs par les tiennes depuis supabase.com > Settings > API
const SUPABASE_URL = 'https://TON_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'TON_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
