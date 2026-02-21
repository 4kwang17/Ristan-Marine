'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/lib/i18n'
import dynamic from 'next/dynamic'
import CategoryFilter from '@/components/catalog/CategoryFilter'

const ProductGrid = dynamic(() => import('@/components/catalog/ProductGrid'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

interface UserProfile {
  full_name: string
  company: string
  expires_at: string
}

export default function CatalogPage() {
  const router = useRouter()
  const { t } = useLang()
  const c = t.catalog

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  // Debounced auto-search: fires 400ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/catalog/login'); return }
      const { data } = await supabase
        .from('user_profiles')
        .select('full_name, company, expires_at')
        .eq('id', user.id)
        .single()
      if (data) {
        setProfile(data)
        const diff = Math.ceil((new Date(data.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        setDaysLeft(diff)
      }
    }
    loadProfile()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/catalog/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:h-[calc(100vh-4rem)] lg:flex lg:flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191F28]">{c.title}</h1>
          {profile && (
            <p className="text-sm text-[#8B95A1] mt-1">
              {profile.full_name} ({profile.company})
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {daysLeft !== null && daysLeft <= 7 && (
            <div className={`text-sm px-3 py-1.5 rounded-lg ${daysLeft <= 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
              ⚠ {daysLeft} {c.expiresWarning}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-[#8B95A1] hover:text-[#191F28] border border-[#E5E8EB] px-4 py-2 rounded-xl transition-colors"
          >
            {c.logoutBtn}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={c.searchPlaceholder}
          className="flex-1 border border-[#E5E8EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-[#1A73E8] text-white font-medium px-5 py-2.5 rounded-xl hover:bg-[#1557b0] transition-colors text-sm"
        >
          {c.searchBtn}
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); setSearchInput('') }}
            className="border border-[#E5E8EB] text-[#8B95A1] px-4 py-2.5 rounded-xl hover:border-[#191F28] transition-colors text-sm"
          >
            {c.resetBtn}
          </button>
        )}
      </form>

      {/* Mobile category filter (above grid) */}
      <div className="lg:hidden mb-4">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border border-[#E5E8EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
        >
          <option value="">{c.allCategories}</option>
        </select>
      </div>

      {/* Grid + Sidebar */}
      <div className="flex gap-4 lg:flex-1 lg:min-h-0">
        <div className="hidden lg:flex lg:flex-col w-48 flex-shrink-0">
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>

        <div className="flex-1 min-w-0 lg:min-h-0">
          <ProductGrid category={category} search={search} />
        </div>
      </div>
    </div>
  )
}
