'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/i18n'

export default function CompanyPage() {
  const pathname = usePathname()
  const { t } = useLang()
  const c = t.company

  const subnav = [
    { label: c.subnav.about, href: '/company' },
    { label: c.subnav.history, href: '/company/history' },
    { label: c.subnav.organization, href: '/company/organization' },
    { label: c.subnav.location, href: '/company/location' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Sub navigation */}
      <nav className="flex gap-2 mb-10 border-b border-[#E5E8EB] pb-4 flex-wrap">
        {subnav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              pathname === item.href
                ? 'text-[#1A73E8] bg-[#EFF6FF]'
                : 'text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F8F9FA]'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#191F28] mb-4">{c.about.title}</h1>
        <p className="text-lg text-[#8B95A1]">{c.about.subtitle}</p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div>
          <div className="bg-gradient-to-br from-[#1A73E8] to-[#0D47A1] rounded-2xl p-8 text-white h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3">⚓</div>
              <div className="text-xl font-bold">RISTAN MARINE</div>
              <div className="text-blue-200 text-sm mt-1">Since 2004</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#191F28] mb-4">{c.about.trustTitle}</h2>
          <p className="text-[#8B95A1] leading-relaxed mb-4">{c.about.desc1}</p>
          <p className="text-[#8B95A1] leading-relaxed">{c.about.desc2}</p>
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-white rounded-2xl border border-[#E5E8EB] p-8 mb-10">
        <h3 className="text-xl font-bold text-[#191F28] mb-6">{c.about.infoTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
          {c.about.infoItems.map((item) => (
            <div key={item.label} className="flex gap-4">
              <span className="text-sm text-[#8B95A1] w-28 flex-shrink-0">{item.label}</span>
              <span className="text-sm font-medium text-[#191F28]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subnav.slice(1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-[#E5E8EB] rounded-2xl p-6 hover:border-[#1A73E8] hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
          >
            <span className="font-semibold text-[#191F28]">{item.label}</span>
            <svg className="w-5 h-5 text-[#8B95A1] group-hover:text-[#1A73E8] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
