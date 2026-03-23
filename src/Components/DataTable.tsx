import { useState, useMemo } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Stack,
  Table, Pagination, Modal, Select,
} from '@mantine/core'
import { IconSearch, IconAdjustments, IconArrowUp, IconArrowDown } from '@tabler/icons-react'

export type SortOrder = 'asc' | 'desc'

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

interface DataTableProps<T extends { id: number }> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchableFields?: (keyof T)[]
  filterFields?: FilterField<T>[]
  filterOptions?: Record<string, { value: string; label: string }[]>
  itemsPerPage?: number
  emptyMessage?: string
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  searchPlaceholder = 'Search',
  searchableFields = [],
  filterFields = [],
  filterOptions = {},
  itemsPerPage = 10,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filterValues, setFilterValues] = useState<Record<string, string | null>>({})
  const [currentPage, setCurrentPage] = useState(1)

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

  const handleClearFilters = () => {
    setFilterValues({})
    setCurrentPage(1)
  }

  return (
    <>
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          {filterFields.length > 0 && (
            <Button
              variant="default"
              size="sm"
              leftSection={<IconAdjustments size={14} />}
              onClick={() => setFilterModalOpen(true)}
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
        <Text size="sm" c="dimmed">{sortedData.length} records</Text>
      </Group>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <Table withColumnBorders highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              {columns.map(col => (
                <Table.Th
                  key={String(col.key)}
                  fw={700}
                  onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                  style={col.sortable ? { cursor: 'pointer' } : undefined}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortOrder === 'asc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedData.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text c="dimmed" ta="center" py="lg">{emptyMessage}</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedData.map(row => (
                <Table.Tr key={row.id}>
                  {columns.map(col => (
                    <Table.Td key={String(col.key)}>
                      {col.render ? col.render(row) : String(row[col.key])}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </Group>
      )}

      {filterFields.length > 0 && (
        <Modal
          opened={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          title="Filter Options"
          centered
        >
          <Stack gap="md">
            {filterFields.map(field => (
              <Select
                key={String(field.key)}
                label={field.label}
                placeholder={`All ${field.label}s`}
                data={filterOptions[String(field.key)] || []}
                value={filterValues[String(field.key)] || null}
                onChange={(value) => handleFilterChange(String(field.key), value)}
                clearable
              />
            ))}
            <Group justify="flex-end">
              <Button variant="default" onClick={handleClearFilters}>
                Clear
              </Button>
              <Button onClick={() => setFilterModalOpen(false)}>
                Apply
              </Button>
            </Group>
          </Stack>
        </Modal>
      )}
    </>
  )
}
