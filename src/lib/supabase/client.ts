"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./constants";

export const supabaseBrowserClient = createPagesBrowserClient({
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_ANON_KEY,
});