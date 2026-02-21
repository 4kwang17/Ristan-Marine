'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/lib/i18n'
import Link from 'next/link'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const { t } = useLang()
  const s = t.signup

  const [form, setForm] = useState({
    fullName: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError(s.passwordMismatch)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      // Create auth user
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (authError) throw authError
      if (!data.user) throw new Error('Signup failed')

      // Create user_profile with 30-day trial
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: data.user.id,
          full_name: form.fullName,
          company: form.company,
          expires_at: expiresAt.toISOString(),
        }])

      if (profileError) throw profileError

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError('')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?signup=1`,
      },
    })
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#191F28] mb-2">{s.successTitle}</h2>
          <p className="text-[#8B95A1] mb-8">{s.successDesc}</p>
          <button
            onClick={() => router.push('/catalog')}
            className="bg-[#1A73E8] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#1557b0] transition-colors"
          >
            {s.goCatalog}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1A73E8] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l3-8 4 4 4-6 4 6 3-3" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#191F28]">{s.title}</h1>
          <p className="text-sm text-[#8B95A1] mt-1">
            {s.subtitle}{' '}
            <Link href="/catalog/login" className="text-[#1A73E8] font-medium hover:underline">
              {s.loginLink}
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E8EB] p-8 shadow-sm space-y-4">

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#E5E8EB] rounded-xl py-3 text-sm font-medium text-[#191F28] hover:bg-[#F8F9FA] transition-colors disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? '...' : s.googleBtn}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E8EB]" />
            <span className="text-xs text-[#8B95A1]">{s.orDivider}</span>
            <div className="flex-1 h-px bg-[#E5E8EB]" />
          </div>

          {/* Signup form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-1.5">{s.fullName}</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder={s.fullNamePlaceholder}
                  className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-1.5">{s.company}</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder={s.companyPlaceholder}
                  className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#191F28] mb-1.5">{s.email}</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder={s.emailPlaceholder}
                className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#191F28] mb-1.5">{s.password}</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder={s.passwordPlaceholder}
                className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#191F28] mb-1.5">{s.confirmPassword}</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder={s.confirmPasswordPlaceholder}
                className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Trial notice */}
            <p className="text-xs text-[#8B95A1] text-center">{s.trialNotice}</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A73E8] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1557b0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? s.submitting : s.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
