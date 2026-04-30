import { useState, useMemo } from 'react'
import {
  Group, Button, Text, TextInput, Paper,
  Table, Pagination, Select, Collapse, Checkbox, Box
} from '@mantine/core'
import { IconSearch, IconAdjustments, IconArrowUp, IconArrowDown, IconX } from '@tabler/icons-react'

export type SortOrder = 'asc' | 'desc'

export type { Tab } from './SiteHeader'

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

export interface FilterField<T> {
  key: keyof T
  label: string
}

export interface ActionButton<T> {
  label: string
  onClick: (row: T) => void
  disabled?: (row: T) => boolean
  variant?: 'filled' | 'light' | 'default'
  color?: string
}

interface ActionTableProps<T extends { id: number }> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchableFields?: (keyof T)[]
  filterFields?: FilterField<T>[]
  filterOptions?: Record<string, { value: string; label: string }[]>
  itemsPerPage?: number
  emptyMessage?: string
  onDeleteSelected?: (ids: number[]) => void
  onExportSelected?: (ids: number[]) => void
  exportLabel?: string
  deleteLabel?: string
  actionButtons?: ActionButton<T>[]
}

export default function ActionTable<T extends { id: number }>({
  data,
  columns,
  searchPlaceholder = 'Search',
  searchableFields = [],
  filterFields = [],
  filterOptions = {},
  itemsPerPage = 10,
  emptyMessage = 'No data available',
  onDeleteSelected,
  onExportSelected,
  exportLabel = 'Export Records',
  deleteLabel = 'Delete Selected',
  actionButtons = [],
}: ActionTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterValues, setFilterValues] = useState<Record<string, string | null>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const handleFilterChange = (key: string, value: string | null) => {
    setFilterValues(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilterValues({})
    setCurrentPage(1)
  }

  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch = searchableFields.some(field => {
          const value = row[field]
          return value && String(value).toLowerCase().includes(searchLower)
        })
        if (!matchesSearch) return false
      }

      for (const field of filterFields) {
        const key = String(field.key)
        const filterValue = filterValues[key]
        if (filterValue) {
          const rowValue = row[field.key]
          if (rowValue !== filterValue) return false
        }
      }

      return true
    })
  }, [data, search, searchableFields, filterFields, filterValues])

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey as keyof T]
      const bVal = b[sortKey as keyof T]
      const modifier = sortOrder === 'asc' ? 1 : -1

      if (aVal === bVal) return 0
      if (!aVal) return 1
      if (!bVal) return -1
      if (aVal < bVal) return -1 * modifier
      return 1 * modifier
    })
  }, [filteredData, sortKey, sortOrder])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedData.map(row => row.id))
    }
  }

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    onDeleteSelected?.(selectedIds)
    setSelectedIds([])
  }

  const handleExportSelected = () => {
    onExportSelected?.(selectedIds)
  }

  return (
    <>
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          {filterFields.length > 0 && (
            <Button
              variant={filterOpen ? 'filled' : 'default'}
              color="brand-purple"
              size="sm"
              leftSection={<IconAdjustments size={14} />}
              onClick={() => setFilterOpen(o => !o)}
            >
              Filter
            </Button>
          )}
          {searchableFields.length > 0 && (
            <TextInput
              placeholder={searchPlaceholder}
              leftSection={<IconSearch size={14} />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              w={180}
            />
          )}
        </Group>
        <Group gap="md">
          <Text size="sm" c="dimmed">{sortedData.length} records</Text>
          {onDeleteSelected && (
            <Button
              variant="light"
              color="red"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
            >
              {deleteLabel}
            </Button>
          )}
          {onExportSelected && (
            <Button
              color="brand-purple"
              size="sm"
              onClick={handleExportSelected}
              disabled={selectedIds.length === 0}
            >
              {exportLabel}
            </Button>
          )}
        </Group>
      </Group>

      {filterFields.length > 0 && (
        <Collapse in={filterOpen}>
          <Paper withBorder shadow="xs" p="md" radius="md" mb="sm">
            <Group align="flex-end" gap="md">
              {filterFields.map(field => (
                <Select
                  key={String(field.key)}
                  label={field.label}
                  placeholder={`All ${field.label}s`}
                  data={filterOptions[String(field.key)] || []}
                  value={filterValues[String(field.key)] || null}
                  onChange={(value) => handleFilterChange(String(field.key), value)}
                  clearable
                  style={{ flex: 1 }}
                />
              ))}
              <Button
                variant="default"
                leftSection={<IconX size={14} />}
                onClick={handleClearFilters}
                mb={1}
              >
                Clear
              </Button>
            </Group>
          </Paper>
        </Collapse>
      )}

      <Paper withBorder shadow="xs" radius="md" style={{ overflow: 'hidden' }} mih={400}>
        <Box style={{ overflowX: 'auto' }}>
          <Table withColumnBorders highlightOnHover verticalSpacing="md" miw={800}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th fw={700} w={40}>
                  <Checkbox
                    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedData.length}
                    onChange={handleSelectAll}
                  />
                </Table.Th>
                {columns.map(col => (
                  <Table.Th
                    key={String(col.key)}
                    fw={700}
                    onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                    style={col.sortable ? { cursor: 'pointer', whiteSpace: 'nowrap' } : { whiteSpace: 'nowrap' }}
                  >
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortOrder === 'asc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />
                    )}
                  </Table.Th>
                ))}
                {actionButtons.length > 0 && (
                  <Table.Th fw={700} style={{ whiteSpace: 'nowrap' }}>Actions</Table.Th>
                )}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={columns.length + (actionButtons.length > 0 ? 1 : 0) + 1}>
                    <Text c="dimmed" ta="center" py="lg">{emptyMessage}</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginatedData.map(row => (
                  <Table.Tr key={row.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                      />
                    </Table.Td>
                    {columns.map(col => (
                      <Table.Td key={String(col.key)}>
                        {col.render ? col.render(row) : String(row[col.key])}
                      </Table.Td>
                    ))}
                    {actionButtons.length > 0 && (
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          {actionButtons.map((btn, idx) => (
                            <Button
                              key={idx}
                              size="xs"
                              variant={btn.variant || 'light'}
                              color={btn.color || 'brand-blue'}
                              onClick={() => btn.onClick(row)}
                              disabled={btn.disabled?.(row)}
                            >
                              {btn.label}
                            </Button>
                          ))}
                        </Group>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </Paper>

      <Group justify="center" mt="md" style={{ visibility: totalPages > 1 ? 'visible' : 'hidden' }}>
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={setCurrentPage}
          color="brand-purple"
        />
      </Group>
    </>
  )
}