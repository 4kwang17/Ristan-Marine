'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/i18n'

const DEPT_STYLES = [
  { color: 'bg-[#EFF6FF] border-[#BFDBFE]', titleColor: 'text-[#1A73E8]' },
  { color: 'bg-[#F0FDF4] border-[#BBF7D0]', titleColor: 'text-[#16A34A]' },
  { color: 'bg-[#FFF7ED] border-[#FED7AA]', titleColor: 'text-[#EA580C]' },
]

export default function OrganizationPage() {
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

      <h1 className="text-4xl font-bold text-[#191F28] mb-4">{c.organization.title}</h1>
      <p className="text-[#8B95A1] mb-12 text-lg">{c.organization.subtitle}</p>

      {/* Org chart */}
      <div className="flex flex-col items-center gap-6">
        {/* CEO */}
        <div className="bg-gradient-to-br from-[#1A73E8] to-[#0D47A1] text-white rounded-2xl px-8 py-4 text-center shadow-lg min-w-48">
          <div className="text-xs text-blue-200 mb-1">{c.organization.ceoLabel}</div>
          <div className="font-bold text-lg">{c.organization.ceoTitle}</div>
        </div>

        {/* Line */}
        <div className="w-0.5 h-8 bg-[#E5E8EB]" />

        {/* Departments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {c.organization.departments.map((dept, i) => (
            <div key={dept.title} className={`${DEPT_STYLES[i].color} border rounded-2xl p-6 text-center`}>
              <div className={`font-bold text-lg ${DEPT_STYLES[i].titleColor} mb-4`}>{dept.title}</div>
              <ul className="space-y-2">
                {dept.roles.map((role) => (
                  <li key={role} className="bg-white rounded-xl px-3 py-2 text-sm text-[#191F28] shadow-sm">
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
