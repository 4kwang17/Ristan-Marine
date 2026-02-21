'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  const n = t.nav

  return (
    <footer className="bg-[#191F28] text-[#8B95A1] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#1A73E8] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l3-8 4 4 4-6 4 6 3-3" />
                </svg>
              </div>
              <span className="text-white font-bold text-base">RISTAN MARINE</span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {f.tagline}{'\n'}{f.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">{f.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/company" className="hover:text-white transition-colors">{n.company}</Link></li>
              <li><Link href="/business" className="hover:text-white transition-colors">{n.business}</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">{n.catalog}</Link></li>
              <li><Link href="/inquiry" className="hover:text-white transition-colors">{n.inquiry}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">{f.contact}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{f.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@ristan-marine.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#2D3748] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <span>{f.rights}</span>
          <span>{f.bizNumber}</span>
        </div>
      </div>
    </footer>
  )
}
