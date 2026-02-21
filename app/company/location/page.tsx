'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/i18n'

// Kakao Maps embed (Korean) — coordinates for Jung-gu, Busan
const KAKAO_MAP = 'https://map.kakao.com/link/map/부산광역시 중구 중앙대로,35.0985,129.0353'

// Google Maps embed (English)
const GOOGLE_MAP = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.6!2d129.0353!3d35.0985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDA1JzU0LjYiTiAxMjnCsDAyJzA3LjEiRQ!5e0!3m2!1sen!2skr!4v1700000000000'

export default function LocationPage() {
  const pathname = usePathname()
  const { lang, t } = useLang()
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

      <h1 className="text-4xl font-bold text-[#191F28] mb-4">{c.location.title}</h1>
      <p className="text-[#8B95A1] mb-10 text-lg">{c.location.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map — Kakao for KO, Google for EN */}
        <div className="lg:col-span-2">
          <div className="bg-[#E5E8EB] rounded-2xl overflow-hidden" style={{ height: '400px' }}>
            {lang === 'ko' ? (
              <iframe
                src={KAKAO_MAP}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                title="Ristan Marine 위치"
              />
            ) : (
              <iframe
                src={GOOGLE_MAP}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Ristan Marine Location"
              />
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5E8EB] p-6">
            <h3 className="font-bold text-[#191F28] mb-4">{c.location.contactTitle}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#1A73E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#8B95A1] mb-0.5">{c.location.addressLabel}</div>
                  <div className="font-medium text-[#191F28]">{c.location.addressValue}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#1A73E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#8B95A1] mb-0.5">{c.location.emailLabel}</div>
                  <div className="font-medium text-[#191F28]">info@ristan-marine.com</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E8EB] p-6">
            <h3 className="font-bold text-[#191F28] mb-4">{c.location.hoursTitle}</h3>
            <ul className="space-y-2 text-sm">
              {c.location.hours.map((row) => (
                <li key={row.day} className="flex justify-between">
                  <span className="text-[#8B95A1]">{row.day}</span>
                  <span className="font-medium text-[#191F28]">{row.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
