import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from "next/server";

export const createClient = (req, res) => {
  if (!req) throw new Error('Request is required');
  
  return createMiddlewareClient({
    req,
    res,
  }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
};

export async function updateSession(req) {
  if (!req) {
    throw new Error('Request is required');
  }

  const supabase = createClient(req);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }

  return session;
}
