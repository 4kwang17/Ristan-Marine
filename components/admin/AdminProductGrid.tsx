'use client'

import { useCallback, useRef, useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  ColDef,
  GridReadyEvent,
  IDatasource,
  CellValueChangedEvent,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { getProductImageUrl } from '@/lib/r2'

function ImageCell({ value, data, api }: any) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('productId', String(data.id))

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    const result = await res.json()
    if (result.filename) {
      await fetch(`/api/products?id=${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.id, image: result.filename }),
      })
      api.refreshInfiniteCache()
    }
  }

  return (
    <label className="cursor-pointer block w-8 h-8">
      {value ? (
        <img
          src={getProductImageUrl(value)}
          alt="product"
          className="w-8 h-8 object-cover rounded border border-[#E5E8EB]"
          onError={(e) => { (e.target as HTMLImageElement).src = '' }}
        />
      ) : (
        <div className="w-8 h-8 bg-[#F8F9FA] rounded border border-dashed border-[#E5E8EB] flex items-center justify-center">
          <span className="text-[10px] text-[#8B95A1]">+</span>
        </div>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </label>
  )
}

export default function AdminProductGrid() {
  const gridRef = useRef<AgGridReact>(null)
  const [saving, setSaving] = useState<Set<number>>(new Set())
  const [newRow, setNewRow] = useState(false)

  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'image',
      headerName: '이미지',
      width: 70,
      sortable: false,
      filter: false,
      cellRenderer: ImageCell,
      editable: false,
      pinned: 'left',
    },
    { field: 'item_name_kr', headerName: '한국명', flex: 1, minWidth: 130, editable: true },
    { field: 'item_name_en', headerName: '영문명', flex: 1, minWidth: 130, editable: true },
    { field: 'item_name_cn', headerName: '중국명', width: 110, editable: true },
    { field: 'item_name_ru', headerName: '러시아어', width: 110, editable: true },
    { field: 'impa_code', headerName: 'IMPA', width: 100, editable: true },
    { field: 'issa_code', headerName: 'ISSA', width: 100, editable: true },
    { field: 'category', headerName: '카테고리', width: 130, editable: true },
    { field: 'brand', headerName: '브랜드', width: 110, editable: true },
    { field: 'unit', headerName: '단위', width: 80, editable: true },
    {
      field: 'price_krw',
      headerName: '단가(KRW)',
      width: 110,
      editable: true,
      valueFormatter: (p) => p.value ? `₩${Number(p.value).toLocaleString()}` : '',
    },
    { field: 'country_of_origin', headerName: '원산지', width: 100, editable: true },
    { field: 'remark', headerName: '비고', flex: 1, minWidth: 120, editable: true },
    {
      headerName: '삭제',
      width: 70,
      sortable: false,
      filter: false,
      editable: false,
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleDelete(params.data?.id)}
          className="text-red-500 hover:text-red-700 text-xs"
        >
          삭제
        </button>
      ),
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
  }), [])

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption('datasource', datasource)
  }, [datasource])

  const onCellValueChanged = useCallback(async (event: CellValueChangedEvent) => {
    const { data } = event
    if (!data?.id) return

    setSaving(prev => new Set(prev).add(data.id))
    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } finally {
      setSaving(prev => {
        const next = new Set(prev)
        next.delete(data.id)
        return next
      })
    }
  }, [])

  const handleDelete = async (id: number) => {
    if (!id || !confirm('이 제품을 삭제하시겠습니까?')) return
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    gridRef.current?.api.refreshInfiniteCache()
  }

  const handleAddRow = async () => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_name_kr: '새 제품', item_name_en: 'New Product' }),
    })
    if (res.ok) {
      gridRef.current?.api.refreshInfiniteCache()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-[#8B95A1]">
          셀을 더블클릭하여 수정 / 이미지 클릭하여 업로드
        </div>
        <button
          onClick={handleAddRow}
          className="bg-[#1A73E8] text-white font-medium px-4 py-2 rounded-xl hover:bg-[#1557b0] transition-colors text-sm"
        >
          + 제품 추가
        </button>
      </div>
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
          onCellValueChanged={onCellValueChanged}
          rowHeight={48}
          headerHeight={44}
          animateRows={false}
          stopEditingWhenCellsLoseFocus={true}
          enableCellTextSelection={false}
        />
      </div>
    </div>
  )
}
