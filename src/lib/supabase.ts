// Re-export from the new supabase client utility
// This maintains backward compatibility while using @supabase/ssr properly
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

const isConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!isConfigured) {
  console.warn("Supabase credentials not configured. Auth will be disabled. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

// Use @supabase/ssr createBrowserClient for proper cookie management in Next.js App Router
export const supabase = isConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : createBrowserClient("https://placeholder.supabase.co", "placeholder");

export { isConfigured as isSupabaseConfigured };
