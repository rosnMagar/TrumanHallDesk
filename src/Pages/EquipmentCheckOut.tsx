import { useState } from 'react'
import {
  AppShell, Group, Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack, Box, Table, Pagination,
} from '@mantine/core'
import SiteFooter from '../Components/SiteFooter'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import { IconCheck, IconX, IconSearch, IconAdjustments } from '@tabler/icons-react'

interface EquipmentRow {
  id: number
  equipment: string
  dateOut: string
  borrower: string
  bannerId: string
  daysOut: number | null
  phone: string
  available: boolean
}

interface CheckoutForm {
  bannerId: string
  residentName: string
  phoneNumber: string
  equipment1: string
  equipment2: string
  equipment3: string
}

const INITIAL_ROWS: EquipmentRow[] = [
  { id: 1, equipment: 'Red Pot that is super red jdlkjlkjdlfjklsfjlkaj', dateOut: '01/01/2020', borrower: 'John Smith testing to see if it wraps lllllllllllllllllllllllllllllllllllllllll', bannerId: '123456789', daysOut: 2, phone: '123-456-7890', available: false },
  { id: 2, equipment: 'Black Pan', dateOut: '', borrower: '', bannerId: '', daysOut: null, phone: '', available: true },
  ...Array.from({ length: 13 }, (_, i) => ({
    id: i + 3, equipment: '', dateOut: '', borrower: '', bannerId: '', daysOut: null, phone: '', available: false,
  })),
]

export default function EquipmentCheckOut() {
  const [activeTab, setActiveTab] = useState<Tab>('Equipment')
  const [activePage, setActivePage] = useState(2)
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState<EquipmentRow[]>(INITIAL_ROWS)

  const [form, setForm] = useState<CheckoutForm>({
    bannerId: '', residentName: '', phoneNumber: '',
    equipment1: '', equipment2: '', equipment3: '',
  })

  const setField = (f: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const handleBorrow = (id: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, available: false } : r))
  }

  const filteredRows = rows.filter(r =>
    !search ||
    r.equipment.toLowerCase().includes(search.toLowerCase()) ||
    r.borrower.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>

      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main */}
      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">

          {/* Equipment Check Out Form */}
          <Paper
            withBorder shadow="xs" p="xl" radius="md"
            style={{ borderWidth: 2 }}
          >
            <Title order={4} mb="lg">Equipment Check Out</Title>
            <Stack gap="md">
              <SimpleGrid cols={3} spacing="md">
                <TextInput
                  label="Banner ID"
                  description="Please swipe the resident's badge"
                  placeholder="Banner ID"
                  value={form.bannerId}
                  onChange={setField('bannerId')}
                />
                <TextInput
                  label="Resident Name"
                  description="This will be autofilled after swiping badge"
                  placeholder="Smith, John"
                  value={form.residentName}
                  onChange={setField('residentName')}
                />
                <TextInput
                  label="Resident Phone Number"
                  description="Phone will be autofilled after swiping badge"
                  placeholder="123-456-7890"
                  value={form.phoneNumber}
                  onChange={setField('phoneNumber')}
                />
              </SimpleGrid>

              <Stack gap={4}>
                <Text size="sm" fw={600}>Equipment Selection</Text>
                <Text size="xs" c="dimmed">Select at least one equipment item to check it out to resident.</Text>
                <SimpleGrid cols={3} spacing="md">
                  <TextInput placeholder="Equipment Dropdown" value={form.equipment1} onChange={setField('equipment1')} />
                  <TextInput placeholder="Equipment Dropdown" value={form.equipment2} onChange={setField('equipment2')} />
                  <TextInput placeholder="Equipment Dropdown" value={form.equipment3} onChange={setField('equipment3')} />
                </SimpleGrid>
              </Stack>
            </Stack>
          </Paper>

          {/* Inventory Table */}
          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={3}>Inventory</Title>
              <Group gap="sm">
                <Button variant="default" size="sm" leftSection={<IconAdjustments size={14} />}>
                  Filter
                </Button>
                <TextInput
                  placeholder="Search"
                  leftSection={<IconSearch size={14} />}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  w={180}
                />
              </Group>
            </Group>

            <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
              <Table withColumnBorders highlightOnHover verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th fw={700}>Equipment</Table.Th>
                    <Table.Th fw={700}>Date Out</Table.Th>
                    <Table.Th fw={700}>Borrower</Table.Th>
                    <Table.Th fw={700}>Banner ID</Table.Th>
                    <Table.Th fw={700}>Days Out</Table.Th>
                    <Table.Th fw={700}>Phone #</Table.Th>
                    <Table.Th fw={700}>Availability</Table.Th>
                    <Table.Th fw={700}>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredRows.map(row => (
                    <Table.Tr key={row.id}>
                      <Table.Td>{row.equipment}</Table.Td>
                      <Table.Td>{row.dateOut}</Table.Td>
                      <Table.Td>
                        <Text lineClamp={2} size="sm">{row.borrower}</Text>
                      </Table.Td>
                      <Table.Td>{row.bannerId}</Table.Td>
                      <Table.Td>{row.daysOut ?? ''}</Table.Td>
                      <Table.Td>{row.phone}</Table.Td>
                      <Table.Td>
                        {row.equipment ? (
                          row.available
                            ? <IconCheck size={16} color="green" />
                            : <IconX size={16} color="red" />
                        ) : null}
                      </Table.Td>
                      <Table.Td>
                        {row.equipment && (
                          row.available ? (
                            <Button size="xs" color="grape" onClick={() => handleBorrow(row.id)}>
                              Borrow
                            </Button>
                          ) : (
                            <Button size="xs" variant="light" color="grape">
                              Forward
                            </Button>
                          )
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>

            <Group justify="center">
              <Pagination
                total={10}
                value={activePage}
                onChange={setActivePage}
                color="grape"
                siblings={1}
                boundaries={1}
              />
            </Group>
          </Stack>

        </Stack>
      </AppShell.Main>

      <SiteFooter />
    </AppShell>
  )
}