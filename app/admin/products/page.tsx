import dynamic from 'next/dynamic'

const AdminProductGrid = dynamic(() => import('@/components/admin/AdminProductGrid'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function AdminProductsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#191F28] mb-6">제품 관리</h1>
      <AdminProductGrid />
    </div>
  )
}
