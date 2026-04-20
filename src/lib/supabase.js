import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Will be null-ish until real credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Validate the site-wide access password.
 *
 * For now (dev mode, no Supabase), accepts any non-empty password.
 * In production, this will call a Supabase Edge Function that validates
 * against a bcrypt hash stored server-side.
 */
export async function validatePassword(password) {
  // Production: call Supabase Edge Function
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('validate-password', {
        body: { password },
      });
      if (error) throw error;
      return data?.valid === true;
    } catch (err) {
      // Edge Function not deployed yet — fall back to dev password
      if (import.meta.env.DEV) console.warn('Edge Function unavailable, falling back to dev password:', err.message);
      const devPassword = import.meta.env.VITE_DEV_PASSWORD;
      if (devPassword) return password === devPassword;
      return false;
    }
  }

  // No Supabase configured — use dev password (must be set in .env)
  const devPassword = import.meta.env.VITE_DEV_PASSWORD;
  if (!devPassword) return false;
  return password === devPassword;
}
