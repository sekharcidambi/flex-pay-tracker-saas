import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('Auth callback received:', { code: !!code });

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    try {
      console.log('Exchanging code for session...');
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        throw error;
      }
      
      console.log('Session exchange successful:', { user: data.user?.id });
    } catch (error) {
      console.error('Failed to exchange code for session:', error);
      return NextResponse.redirect(new URL('/auth?error=auth_callback_failed', requestUrl.origin));
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 