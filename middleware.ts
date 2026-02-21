import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function detectLang(request: NextRequest): 'ko' | 'en' {
  // Already set by user preference
  const existing = request.cookies.get('lang')?.value
  if (existing === 'ko' || existing === 'en') return existing

  // Vercel provides country header in production
  const country = request.headers.get('x-vercel-ip-country')
  if (country) return country === 'KR' ? 'ko' : 'en'

  // Fallback: Accept-Language header
  const acceptLang = request.headers.get('accept-language') || ''
  return acceptLang.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // ── Language detection ────────────────────────────────────────────────────
  const lang = detectLang(request)
  if (!request.cookies.get('lang')) {
    supabaseResponse.cookies.set('lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          // Re-apply lang cookie after supabaseResponse is recreated
          if (!request.cookies.get('lang')) {
            supabaseResponse.cookies.set('lang', lang, {
              path: '/',
              maxAge: 60 * 60 * 24 * 365,
              sameSite: 'lax',
            })
          }
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // ── Admin routes ──────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const referer = request.headers.get('referer')
    const origin = request.nextUrl.origin
    const isSameOriginNonAdmin =
      referer && referer.startsWith(origin) && !new URL(referer).pathname.startsWith('/admin')
    const fallback = request.nextUrl.clone()
    fallback.pathname = '/'
    fallback.search = ''
    const backUrl = isSameOriginNonAdmin ? referer! : fallback.toString()

    if (!user) {
      return NextResponse.redirect(backUrl)
    }

    const role = (user as any)?.app_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(backUrl)
    }
    return supabaseResponse
  }

  // ── Catalog routes ────────────────────────────────────────────────────────
  const catalogPublic = ['/catalog/login', '/catalog/signup', '/catalog/expired']
  if (pathname.startsWith('/catalog') && !catalogPublic.some(p => pathname.startsWith(p))) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/catalog/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('expires_at, is_active')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_active || new Date(profile.expires_at) < new Date()) {
      const url = request.nextUrl.clone()
      url.pathname = '/catalog/expired'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/catalog/:path*',
    '/admin/:path*',
  ],
}
