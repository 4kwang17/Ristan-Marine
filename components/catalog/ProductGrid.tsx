'use client'

import { useCallback, useRef, useMemo, useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridReadyEvent, IDatasource } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { getProductImageUrl } from '@/lib/r2'

interface ProductGridProps {
  category: string
  search: string
}

interface Product {
  id: number
  image: string
  item_name_kr: string
  item_name_en: string
  impa_code: string
  issa_code: string
  category: string
  brand: string
  unit: string
  price_krw: number
}

const PAGE_SIZE = 30

function ImageCell({ value }: { value: string }) {
  if (!value) return <div className="w-8 h-8 bg-[#F8F9FA] rounded" />
  return (
    <img
      src={getProductImageUrl(value)}
      alt="product"
      className="w-8 h-8 object-cover rounded"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}

async function fetchProducts(startRow: number, category: string, search: string) {
  const url = new URL('/api/products', window.location.origin)
  url.searchParams.set('startRow', String(startRow))
  url.searchParams.set('endRow', String(startRow + PAGE_SIZE))
  if (category) url.searchParams.set('category', category)
  if (search) url.searchParams.set('search', search)
  url.searchParams.set('sortField', 'id')
  url.searchParams.set('sortDir', 'asc')
  const res = await fetch(url.toString())
  return res.json()
}

function MobileProductList({ category, search }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const startRowRef = useRef(0)
  const isLoadingRef = useRef(false)

  // Reset and load first page when filters change
  useEffect(() => {
    let cancelled = false
    startRowRef.current = 0
    setProducts([])
    setHasMore(true)
    setLoading(true)

    fetchProducts(0, category, search)
      .then((data) => {
        if (cancelled) return
        const rows: Product[] = data.rows || []
        setProducts(rows)
        startRowRef.current = rows.length
        setHasMore(rows.length === PAGE_SIZE && rows.length < (data.totalCount || 0))
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [category, search])

  const loadMore = async () => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setLoading(true)
    const startRow = startRowRef.current
    try {
      const data = await fetchProducts(startRow, category, search)
      const rows: Product[] = data.rows || []
      setProducts(prev => [...prev, ...rows])
      startRowRef.current = startRow + rows.length
      setHasMore(rows.length === PAGE_SIZE && startRowRef.current < (data.totalCount || 0))
    } catch {
      // ignore
    } finally {
      isLoadingRef.current = false
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div key={p.id} className="bg-white border border-[#E5E8EB] rounded-2xl p-4 flex gap-3">
          <div className="flex-shrink-0">
            {p.image ? (
              <img
                src={getProductImageUrl(p.image)}
                alt="product"
                className="w-14 h-14 object-cover rounded-xl"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div className="w-14 h-14 bg-[#F8F9FA] rounded-xl" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#191F28] text-sm leading-snug">{p.item_name_kr || '-'}</p>
            <p className="text-xs text-[#8B95A1] truncate mt-0.5">{p.item_name_en || '-'}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.impa_code && (
                <span className="text-xs bg-[#F0F6FF] text-[#1A73E8] px-2 py-0.5 rounded-md">IMPA {p.impa_code}</span>
              )}
              {p.category && (
                <span className="text-xs bg-[#F8F9FA] text-[#8B95A1] px-2 py-0.5 rounded-md">{p.category}</span>
              )}
              {p.brand && (
                <span className="text-xs bg-[#F8F9FA] text-[#8B95A1] px-2 py-0.5 rounded-md">{p.brand}</span>
              )}
              {p.unit && (
                <span className="text-xs bg-[#F8F9FA] text-[#8B95A1] px-2 py-0.5 rounded-md">{p.unit}</span>
              )}
            </div>
            {p.price_krw && (
              <p className="mt-2 text-sm font-semibold text-[#191F28]">
                ₩{Number(p.price_krw).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && hasMore && products.length > 0 && (
        <button
          onClick={loadMore}
          className="w-full py-3 text-sm text-[#1A73E8] font-medium border border-[#E5E8EB] rounded-2xl hover:bg-[#F0F6FF] transition-colors"
        >
          더 보기
        </button>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12 text-[#8B95A1] text-sm">검색 결과가 없습니다.</div>
      )}
    </div>
  )
}

export default function ProductGrid({ category, search }: ProductGridProps) {
  const gridRef = useRef<AgGridReact>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'image',
      headerName: '',
      width: 60,
      sortable: false,
      filter: false,
      cellRenderer: ImageCell,
      pinned: 'left',
    },
    {
      field: 'item_name_kr',
      headerName: '한국명',
      flex: 1,
      minWidth: 150,
      filter: false,
    },
    {
      field: 'item_name_en',
      headerName: '영문명',
      flex: 1,
      minWidth: 150,
      filter: false,
    },
    {
      field: 'impa_code',
      headerName: 'IMPA',
      width: 100,
      filter: false,
    },
    {
      field: 'issa_code',
      headerName: 'ISSA',
      width: 100,
      filter: false,
    },
    {
      field: 'category',
      headerName: '카테고리',
      width: 140,
      filter: false,
    },
    {
      field: 'brand',
      headerName: '브랜드',
      width: 120,
      filter: false,
    },
    {
      field: 'unit',
      headerName: '단위',
      width: 80,
      filter: false,
    },
    {
      field: 'price_krw',
      headerName: '단가(KRW)',
      width: 120,
      filter: false,
      valueFormatter: (params) =>
        params.value ? `₩${Number(params.value).toLocaleString()}` : '-',
    },
  ], [])

  const defaultColDef: ColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
  }), [])

  const datasource: IDatasource = useMemo(() => ({
    getRows: async (params) => {
      try {
        const { startRow, endRow, sortModel } = params
        const sortField = sortModel?.[0]?.colId || 'id'
        const sortDir = sortModel?.[0]?.sort || 'asc'

        const url = new URL('/api/products', window.location.origin)
        url.searchParams.set('startRow', String(startRow))
        url.searchParams.set('endRow', String(endRow))
        if (category) url.searchParams.set('category', category)
        if (search) url.searchParams.set('search', search)
        url.searchParams.set('sortField', sortField)
        url.searchParams.set('sortDir', sortDir)

        const res = await fetch(url.toString())
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        params.successCallback(data.rows, data.totalCount)
      } catch {
        params.failCallback()
      }
    },
  }), [category, search])

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption('datasource', datasource)
  }, [datasource])

  const prevCategory = useRef(category)
  const prevSearch = useRef(search)
  if (prevCategory.current !== category || prevSearch.current !== search) {
    prevCategory.current = category
    prevSearch.current = search
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('datasource', datasource)
    }
  }

  if (isMobile) {
    return <MobileProductList category={category} search={search} />
  }

  return (
    <div className="ag-theme-alpine w-full h-[calc(100vh-220px)] rounded-2xl overflow-hidden border border-[#E5E8EB]">
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowModelType="infinite"
        cacheBlockSize={100}
        maxBlocksInCache={10}
        infiniteInitialRowCount={1000}
        datasource={datasource}
        onGridReady={onGridReady}
        rowHeight={48}
        headerHeight={44}
        animateRows={false}
        suppressCellFocus={true}
        suppressMovableColumns={false}
        enableCellTextSelection={true}
      />
    </div>
  )
}
