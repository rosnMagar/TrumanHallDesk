import { useState } from 'react'
import {
  Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack,
} from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import { IconCheck, IconX } from '@tabler/icons-react'
import PageLayout from '../Components/PageLayout'
import ActionTable, { type Column, type FilterField } from '../Components/ActionTable'
import { useFormFields } from '../hooks/useFormField'

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
  { id: 1, equipment: 'Red Pot that is super red jdlkjlkjdlfjklsfjlkaj', dateOut: '01/01/2020', borrower: 'John Smith testing to see if it wraps lllllllllllllllllllllllllcccccccccccccccc', bannerId: '123456789', daysOut: 2, phone: '123-456-7890', available: false },
  { id: 2, equipment: 'Black Pan', dateOut: '', borrower: '', bannerId: '', daysOut: null, phone: '', available: true },
  ...Array.from({ length: 13 }, (_, i) => ({
    id: i + 3, equipment: '', dateOut: '', borrower: '', bannerId: '', daysOut: null, phone: '', available: false,
  })),
]

export default function EquipmentCheckOut() {
  const [activeTab, setActiveTab] = useState<Tab>('Equipment')
  const [rows, setRows] = useState<EquipmentRow[]>(INITIAL_ROWS)

  const { form, setField } = useFormFields<CheckoutForm>({
    bannerId: '', residentName: '', phoneNumber: '',
    equipment1: '', equipment2: '', equipment3: '',
  })

  const handleBorrow = (id: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, available: false } : r))
  }

  const columns: Column<EquipmentRow>[] = [
    { key: 'equipment', label: 'Equipment', sortable: true },
    { key: 'dateOut', label: 'Date Out', sortable: true },
    {
      key: 'borrower', label: 'Borrower', sortable: true,
      render: (row) => <Text lineClamp={2} size="sm">{row.borrower}</Text>,
    },
    { key: 'bannerId', label: 'Banner ID', sortable: true },
    {
      key: 'daysOut', label: 'Days Out', sortable: true,
      render: (row) => <>{row.daysOut ?? ''}</>,
    },
    { key: 'phone', label: 'Phone #', sortable: true },
    {
      key: 'available', label: 'Availability',
      render: (row) => row.equipment ? (
        row.available
          ? <IconCheck size={16} color="green" />
          : <IconX size={16} color="red" />
      ) : null,
    },
    {
      key: 'id', label: 'Action',
      render: (row) => row.equipment ? (
        row.available ? (
          <Button size="xs" color="brand-purple" onClick={() => handleBorrow(row.id)}>
            Borrow
          </Button>
        ) : (
          <Button size="xs" variant="light" color="brand-purple">
            Forward
          </Button>
        )
      ) : null,
    },
  ]

  const filterFields: FilterField<EquipmentRow>[] = [
    { key: 'available', label: 'Availability' },
  ]

  const filterOptions = {
    available: [
      { value: 'true', label: 'Available' },
      { value: 'false', label: 'Unavailable' },
    ],
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="xl" radius="md">
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

      <Stack gap="sm">
        <Title order={3}>Inventory</Title>
        <ActionTable
          data={rows}
          columns={columns}
          searchableFields={['equipment', 'borrower', 'bannerId']}
          filterFields={filterFields}
          filterOptions={filterOptions}
        />
      </Stack>
    </PageLayout>
  )
}