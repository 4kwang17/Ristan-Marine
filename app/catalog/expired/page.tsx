import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '계정 만료 - Ristan Marine',
}

export default function ExpiredPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#191F28] mb-3">계정 이용 기간이 만료되었습니다</h1>
        <p className="text-[#8B95A1] mb-8 leading-relaxed">
          도감 이용 기간이 종료되었습니다.<br />
          계속 이용하시려면 관리자에게 기간 연장을 요청해주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/inquiry"
            className="bg-[#1A73E8] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1557b0] transition-colors"
          >
            기간 연장 문의하기
          </Link>
          <Link
            href="/catalog/login"
            className="border border-[#E5E8EB] text-[#8B95A1] font-semibold px-6 py-3 rounded-xl hover:border-[#191F28] hover:text-[#191F28] transition-colors"
          >
            다른 계정으로 로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
