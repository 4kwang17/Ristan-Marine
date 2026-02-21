import UserTable from '@/components/admin/UserTable'

export default function AdminUsersPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#191F28] mb-6">계정 관리</h1>
      <UserTable />
    </div>
  )
}
