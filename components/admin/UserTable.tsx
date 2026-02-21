'use client'

import { useState, useEffect } from 'react'

interface UserProfile {
  id: string
  full_name: string
  company: string
  expires_at: string
  is_active: boolean
  created_at: string
}

export default function UserTable() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    company: '',
    expires_days: '30',
  })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    if (data.users) setUsers(data.users)
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setShowForm(false)
      setForm({ email: '', password: '', full_name: '', company: '', expires_days: '30' })
      await loadUsers()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !is_active }),
    })
    await loadUsers()
  }

  const handleExtend = async (id: string, days: number) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, extends_days: days }),
    })
    await loadUsers()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${name} 계정을 삭제하시겠습니까?`)) return
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
    await loadUsers()
  }

  const getDaysLeft = (expiresAt: string) => {
    return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div>
      {/* Create User Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-[#8B95A1]">총 {users.length}개 계정</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#1A73E8] text-white font-medium px-4 py-2 rounded-xl hover:bg-[#1557b0] transition-colors text-sm"
        >
          + 계정 생성
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E5E8EB] p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-[#191F28] mb-4">새 계정 생성</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#8B95A1] mb-1">이메일 (아이디)</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-[#E5E8EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                placeholder="user@company.com"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8B95A1] mb-1">임시 비밀번호</label>
              <input
                type="text" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-[#E5E8EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                placeholder="최소 6자"
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-xs text-[#8B95A1] mb-1">이름</label>
              <input
                type="text" required
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full border border-[#E5E8EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8B95A1] mb-1">소속회사</label>
              <input
                type="text" required
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                className="w-full border border-[#E5E8EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                placeholder="선박회사"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8B95A1] mb-1">이용 기간</label>
              <select
                value={form.expires_days}
                onChange={e => setForm(f => ({ ...f, expires_days: e.target.value }))}
                className="w-full border border-[#E5E8EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              >
                <option value="30">30일</option>
                <option value="60">60일</option>
                <option value="90">90일</option>
                <option value="180">180일</option>
                <option value="365">365일</option>
              </select>
            </div>

            {error && (
              <div className="md:col-span-2 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl">
                {error}
              </div>
            )}

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-[#1A73E8] text-white font-medium px-6 py-2.5 rounded-xl hover:bg-[#1557b0] transition-colors text-sm disabled:opacity-60"
              >
                {creating ? '생성 중...' : '계정 생성'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-[#E5E8EB] text-[#8B95A1] font-medium px-6 py-2.5 rounded-xl hover:border-[#191F28] transition-colors text-sm"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E5E8EB] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E8EB]">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B95A1]">이름</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B95A1]">소속</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B95A1]">만료일</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B95A1]">상태</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B95A1]">기간 연장</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E8EB]">
              {users.map((user) => {
                const daysLeft = getDaysLeft(user.expires_at)
                const isExpired = daysLeft < 0
                return (
                  <tr key={user.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#191F28]">{user.full_name}</td>
                    <td className="px-5 py-3.5 text-[#8B95A1]">{user.company}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-[#191F28]">{new Date(user.expires_at).toLocaleDateString('ko-KR')}</div>
                      <div className={`text-xs ${isExpired ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-500' : 'text-[#8B95A1]'}`}>
                        {isExpired ? `${Math.abs(daysLeft)}일 만료` : `${daysLeft}일 남음`}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggle(user.id, user.is_active)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          user.is_active
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {user.is_active ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        {[30, 60, 90].map((days) => (
                          <button
                            key={days}
                            onClick={() => handleExtend(user.id, days)}
                            className="text-xs border border-[#E5E8EB] text-[#8B95A1] px-2 py-1 rounded-lg hover:border-[#1A73E8] hover:text-[#1A73E8] transition-colors"
                          >
                            +{days}일
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(user.id, user.full_name)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
