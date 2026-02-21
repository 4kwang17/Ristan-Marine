'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'

export default function InquiryPage() {
  const { t } = useLang()
  const i = t.inquiry

  const [form, setForm] = useState({
    company: '',
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || i.errorDefault)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#1A73E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#191F28] mb-2">{i.successTitle}</h2>
        <p className="text-[#8B95A1] mb-8">{i.successDesc}</p>
        <button
          onClick={() => {
            setSuccess(false)
            setForm({ company: '', name: '', phone: '', email: '', message: '' })
          }}
          className="bg-[#1A73E8] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#1557b0] transition-colors"
        >
          {i.newInquiry}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-[#191F28] mb-2">{i.title}</h1>
      <p className="text-[#8B95A1] mb-10 text-lg">{i.subtitle}</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E8EB] p-8 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#191F28] mb-1.5">
              {i.company} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              placeholder={i.companyPlaceholder}
              className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191F28] mb-1.5">
              {i.name} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder={i.namePlaceholder}
              className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#191F28] mb-1.5">{i.phone}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder={i.phonePlaceholder}
              className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191F28] mb-1.5">
              {i.email} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder={i.emailPlaceholder}
              className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#191F28] mb-1.5">
            {i.message} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            rows={6}
            placeholder={i.messagePlaceholder}
            className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent transition-all resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A73E8] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1557b0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? i.submitting : i.submit}
        </button>
      </form>
    </div>
  )
}
