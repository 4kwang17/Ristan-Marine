import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { LanguageProvider } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n/translations'

export const metadata: Metadata = {
  title: 'Ristan Marine - 선박 용품 전문 공급업체',
  description: '리스탄마린은 2004년 창업 이후 선용품 공급 분야에서 신뢰를 쌓아온 전문 기업입니다.',
  keywords: '선용품, 선박용품, 해양장비, 선박기자재, 리스탄마린',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const rawLang = cookieStore.get('lang')?.value
  const lang: Lang = rawLang === 'en' ? 'en' : 'ko'

  return (
    <html lang={lang}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <LanguageProvider defaultLang={lang}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
