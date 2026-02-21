'use client'

import { useCallback, useRef, useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridReadyEvent, IServerSideDatasource, IDatasource } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { getProductImageUrl } from '@/lib/r2'

interface ProductGridProps {
  category: string
  search: string
}

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

export default function ProductGrid({ category, search }: ProductGridProps) {
  const gridRef = useRef<AgGridReact>(null)

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
      } catch (err) {
        params.failCallback()
      }
    },
  }), [category, search])

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption('datasource', datasource)
  }, [datasource])

  // Refresh when filters change
  const prevCategory = useRef(category)
  const prevSearch = useRef(search)
  if (prevCategory.current !== category || prevSearch.current !== search) {
    prevCategory.current = category
    prevSearch.current = search
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('datasource', datasource)
    }
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
