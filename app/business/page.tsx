'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/lib/i18n'

const AREA_META = [
  {
    icon: '🍱',
    number: '01',
    categories: ['Provisions', 'Kitchen', 'Whisky & Tobacco'],
    color: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-100',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    icon: '⚙️',
    number: '02',
    categories: ['Navigation', 'Electrical', 'Machine Parts'],
    color: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-100',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    icon: '🧴',
    number: '03',
    categories: ['Detergents', 'Paint', 'Petroleum'],
    color: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-100',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    icon: '🔧',
    number: '04',
    categories: ['Welding', 'Pipes', 'Valves'],
    color: 'from-slate-50 to-gray-50',
    borderColor: 'border-slate-100',
    badgeColor: 'bg-slate-100 text-slate-700',
  },
  {
    icon: '📦',
    number: '05',
    categories: ['Cargo Handling', 'Ropes'],
    color: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-100',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    icon: '🦺',
    number: '06',
    categories: ['Safety', 'Safety Protection', 'Medicine'],
    color: 'from-red-50 to-rose-50',
    borderColor: 'border-red-100',
    badgeColor: 'bg-red-100 text-red-700',
  },
]

export default function BusinessPage() {
  const { t } = useLang()
  const b = t.business

  const areas = AREA_META.map((meta, i) => ({
    ...meta,
    title: b.areas[i].title,
    desc: b.areas[i].desc,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#191F28] mb-4">{b.pageTitle}</h1>
        <p className="text-lg text-[#8B95A1] max-w-2xl mx-auto">{b.pageDesc}</p>
      </div>

      {/* Business areas */}
      <div className="space-y-8">
        {areas.map((area, i) => (
          <motion.div
            key={area.number}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`bg-gradient-to-br ${area.color} border ${area.borderColor} rounded-2xl p-8 flex flex-col md:flex-row gap-6`}
          >
            <div className="flex items-start gap-5">
              <div className="text-5xl">{area.icon}</div>
              <div className="text-6xl font-black text-[#E5E8EB]">{area.number}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#191F28] mb-3">{area.title}</h2>
              <p className="text-[#8B95A1] mb-4 leading-relaxed">{area.desc}</p>
              <div className="flex flex-wrap gap-2">
                {area.categories.map((cat) => (
                  <span key={cat} className={`text-sm ${area.badgeColor} px-3 py-1 rounded-full font-medium`}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
