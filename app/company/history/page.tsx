'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/i18n'

export default function HistoryPage() {
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

      <h1 className="text-4xl font-bold text-[#191F28] mb-4">{c.history.title}</h1>
      <p className="text-[#8B95A1] mb-12 text-lg">{c.history.subtitle}</p>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#E5E8EB] md:-translate-x-0.5" />

        <div className="space-y-10">
          {c.history.items.map((item, i) => (
            <div key={item.year} className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              {/* Content */}
              <div className={`flex-1 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'} pl-14 md:pl-0`}>
                <div className="bg-white rounded-2xl border border-[#E5E8EB] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-[#1A73E8] mb-3">{item.year}</div>
                  <ul className={`space-y-1.5 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                    {item.events.map((event) => (
                      <li key={event} className="text-sm text-[#191F28] flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-[#1A73E8] rounded-full flex-shrink-0" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Circle on timeline */}
              <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 w-6 h-6 bg-[#1A73E8] rounded-full border-4 border-white shadow flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
