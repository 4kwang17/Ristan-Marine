'use client'

import { useLang } from '@/lib/i18n'

const CATEGORIES = [
  'Provisions',
  'Kitchen',
  'Whisky & Tobacco',
  'Navigation',
  'Electrical',
  'Machine Parts',
  'Detergents',
  'Paint',
  'Petroleum',
  'Welding',
  'Pipes',
  'Valves',
  'Cargo Handling',
  'Ropes',
  'Safety',
  'Safety Protection',
  'Medicine',
  'Deck Equipment',
  'Engine Room',
  'Cabin',
  'Cleaning',
  'Tools',
  'Stationery',
  'Electronics',
  'Clothing',
  'Fire Fighting',
  'Life Saving',
  'Mooring',
  'Hardware',
  'Spare Parts',
]

interface CategoryFilterProps {
  selected: string
  onSelect: (cat: string) => void
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { t } = useLang()

  return (
    <div className="bg-white rounded-2xl border border-[#E5E8EB] p-4 h-full flex flex-col">
      <h3 className="font-semibold text-[#191F28] mb-3 text-sm">{t.catalog.category}</h3>
      <ul className="space-y-0.5 overflow-y-auto flex-1">
        <li>
          <button
            onClick={() => onSelect('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selected === ''
                ? 'bg-[#EFF6FF] text-[#1A73E8] font-medium'
                : 'text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F8F9FA]'
            }`}
          >
            {t.catalog.all}
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onSelect(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selected === cat
                  ? 'bg-[#EFF6FF] text-[#1A73E8] font-medium'
                  : 'text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F8F9FA]'
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
