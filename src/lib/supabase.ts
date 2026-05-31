import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👉 Remplace ces valeurs par les tiennes depuis supabase.com > Settings > API
const SUPABASE_URL = 'https://ijwqatzsdubxhkkqklye.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-GjOGk7eVjkq7pABr6wT-A_JZegbCow';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
