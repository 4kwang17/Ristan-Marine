'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n/translations'

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang, t } = useLang()

  if (pathname.startsWith('/admin')) return null

  const navItems = [
    { label: t.nav.company, href: '/company' },
    { label: t.nav.business, href: '/business' },
    { label: t.nav.catalog, href: '/catalog' },
    { label: t.nav.inquiry, href: '/inquiry' },
  ]

  const toggleLang = () => setLang(lang === 'ko' ? 'en' : 'ko')

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E8EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l3-8 4 4 4-6 4 6 3-3" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#191F28] group-hover:text-[#1A73E8] transition-colors">
              RISTAN MARINE
            </span>
          </Link>

          {/* Desktop Nav + Lang toggle */}
          <div className="hidden md:flex items-center gap-1">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'bg-[#EFF6FF] text-[#1A73E8]'
                      : 'text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Language toggle */}
            <div className="ml-3 flex items-center border border-[#E5E8EB] rounded-lg overflow-hidden">
              <button
                onClick={() => setLang('ko')}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  lang === 'ko'
                    ? 'bg-[#1A73E8] text-white'
                    : 'text-[#8B95A1] hover:text-[#191F28]'
                }`}
              >
                KO
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  lang === 'en'
                    ? 'bg-[#1A73E8] text-white'
                    : 'text-[#8B95A1] hover:text-[#191F28]'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile: lang toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="text-xs font-bold border border-[#E5E8EB] px-2.5 py-1.5 rounded-lg text-[#1A73E8]"
            >
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>
            <button
              className="p-2 rounded-lg text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F8F9FA]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t.header.menuOpen}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-[#E5E8EB]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-[#EFF6FF] text-[#1A73E8]'
                    : 'text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F8F9FA]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
