import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const isSignup = searchParams.get('signup') === '1'

  if (!code) {
    return NextResponse.redirect(`${origin}/catalog/login?error=no_code`)
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/catalog/login?error=auth_failed`)
  }

  const user = data.user

  // Check if user_profile already exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id, expires_at, is_active')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    // New OAuth user: create profile with 3-month trial
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 3)

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User'

    const company =
      user.user_metadata?.hd || // Google Workspace domain
      user.email?.split('@')[1]?.split('.')[0] || // domain prefix
      'Unknown'

    await supabase.from('user_profiles').insert([{
      id: user.id,
      full_name: fullName,
      company: company,
      expires_at: expiresAt.toISOString(),
    }])

    return NextResponse.redirect(`${origin}/catalog`)
  }

  // Existing user: check expiry
  if (!existingProfile.is_active || new Date(existingProfile.expires_at) < new Date()) {
    return NextResponse.redirect(`${origin}/catalog/expired`)
  }

  return NextResponse.redirect(`${origin}/catalog`)
}
