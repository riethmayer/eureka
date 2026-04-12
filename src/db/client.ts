import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Lazy singleton — validation runs on first DB access (request time),
// not at module import time (build time), so next build doesn't require env vars.
let _client: ReturnType<typeof createClient> | null = null;

const getClient = () => {
  if (_client) return _client;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is not set");
  }
  if (!supabaseKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable is not set");
  }

  _client = createClient(supabaseUrl, supabaseKey);
  return _client;
};

export default getClient;
