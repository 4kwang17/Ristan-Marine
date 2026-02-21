'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/lib/i18n'

const AREA_META = [
  { icon: '🍱', number: '01', categories: ['Provisions', 'Kitchen', 'Whisky & Tobacco'] },
  { icon: '⚙️', number: '02', categories: ['Navigation', 'Electrical', 'Machine Parts'] },
  { icon: '🧴', number: '03', categories: ['Detergents', 'Paint', 'Petroleum'] },
  { icon: '🔧', number: '04', categories: ['Welding', 'Pipes', 'Valves'] },
  { icon: '📦', number: '05', categories: ['Cargo Handling', 'Ropes'] },
  { icon: '🦺', number: '06', categories: ['Safety', 'Safety Protection', 'Medicine'] },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

export default function HomePage() {
  const { t } = useLang()
  const h = t.home

  const stats = [
    { label: h.products, value: '55,000', unit: h.productUnit },
    { label: h.founded, value: '2004', unit: h.foundedUnit },
    { label: h.region, value: h.regionValue, unit: '' },
  ]

  const businessAreas = AREA_META.map((meta, i) => ({
    ...meta,
    title: t.business.areas[i].title,
    shortDesc: t.business.areas[i].shortDesc,
  }))

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1A73E8] to-[#0D47A1] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {h.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              RISTAN MARINE
              <br />
              <span className="text-blue-200">{h.heroTitle}</span>
            </h1>
            <p className="text-lg text-blue-100 mb-10 leading-relaxed whitespace-pre-line">
              {h.heroDesc}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="bg-white text-[#1A73E8] font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all duration-200 active:scale-[0.98] shadow-lg"
              >
                {h.catalogBtn}
              </Link>
              <Link
                href="/inquiry"
                className="bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/25 transition-all duration-200 border border-white/30"
              >
                {h.inquiryBtn}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#E5E8EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#1A73E8]">
                  {stat.value}
                  <span className="text-lg text-[#8B95A1] ml-1">{stat.unit}</span>
                </div>
                <div className="text-sm text-[#8B95A1] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#191F28] mb-4">{h.businessTitle}</h2>
          <p className="text-[#8B95A1] text-lg">{h.businessDesc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessAreas.map((area, i) => (
            <motion.div
              key={area.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-[#E5E8EB] p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="text-3xl mb-4">{area.icon}</div>
              <h3 className="text-lg font-bold text-[#191F28] mb-2">{area.title}</h3>
              <p className="text-sm text-[#8B95A1] mb-4 leading-relaxed">{area.shortDesc}</p>
              <div className="flex flex-wrap gap-1.5">
                {area.categories.map((cat) => (
                  <span key={cat} className="text-xs bg-[#EFF6FF] text-[#1A73E8] px-2.5 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/business" className="inline-flex items-center gap-2 text-[#1A73E8] font-semibold hover:underline">
            {h.moreBtn}
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#191F28] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{h.ctaTitle}</h2>
          <p className="text-[#8B95A1] mb-8 text-lg whitespace-pre-line">{h.ctaDesc}</p>
          <Link
            href="/catalog"
            className="inline-block bg-[#1A73E8] text-white font-semibold px-10 py-4 rounded-xl hover:bg-[#1557b0] transition-all duration-200 active:scale-[0.98]"
          >
            {h.catalogBtn}
          </Link>
        </div>
      </section>
    </div>
  )
}
