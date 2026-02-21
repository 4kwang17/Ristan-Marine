import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '관리자 - Ristan Marine',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#191F28] text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-[#2D3748]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1A73E8] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l3-8 4 4 4-6 4 6 3-3" />
              </svg>
            </div>
            <span className="font-bold text-sm">RISTAN MARINE</span>
          </Link>
          <div className="mt-2 text-xs text-[#8B95A1]">관리자 패널</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/admin', label: '대시보드', icon: '📊' },
            { href: '/admin/products', label: '제품 관리', icon: '📦' },
            { href: '/admin/users', label: '계정 관리', icon: '👥' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#8B95A1] hover:text-white hover:bg-[#2D3748] transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#2D3748]">
          <Link href="/" className="flex items-center gap-2 text-sm text-[#8B95A1] hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-[#F8F9FA]">
        {children}
      </main>
    </div>
  )
}
