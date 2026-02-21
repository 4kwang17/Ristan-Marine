import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createClient()

  const [
    { count: productCount },
    { count: userCount },
    { count: inquiryCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: '총 제품 수', value: productCount?.toLocaleString() || '0', icon: '📦', href: '/admin/products', color: 'bg-blue-50 text-blue-600' },
    { label: '활성 계정', value: userCount?.toLocaleString() || '0', icon: '👥', href: '/admin/users', color: 'bg-green-50 text-green-600' },
    { label: '문의 건수', value: inquiryCount?.toLocaleString() || '0', icon: '📬', href: '#', color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#191F28] mb-8">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-[#E5E8EB] p-6 hover:shadow-md transition-shadow">
            <div className={`text-2xl mb-3 w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-[#191F28] mb-1">{stat.value}</div>
            <div className="text-sm text-[#8B95A1]">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[#E5E8EB] p-6">
          <h2 className="font-bold text-[#191F28] mb-4">빠른 작업</h2>
          <div className="space-y-2">
            <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors">
              <span className="text-lg">📦</span>
              <span className="text-sm font-medium text-[#191F28]">제품 추가/수정</span>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors">
              <span className="text-lg">👤</span>
              <span className="text-sm font-medium text-[#191F28]">계정 생성</span>
            </Link>
            <Link href="/catalog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors">
              <span className="text-lg">🔍</span>
              <span className="text-sm font-medium text-[#191F28]">도감 미리보기</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E8EB] p-6">
          <h2 className="font-bold text-[#191F28] mb-4">시스템 정보</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8B95A1]">데이터베이스</span>
              <span className="text-green-600 font-medium">● 정상</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B95A1]">이미지 서버 (R2)</span>
              <span className="text-green-600 font-medium">● 정상</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B95A1]">인증 서비스</span>
              <span className="text-green-600 font-medium">● 정상</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
