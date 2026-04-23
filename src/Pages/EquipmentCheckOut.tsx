import { useState } from 'react'
import {
  Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack, Select, Alert,
} from '@mantine/core'
import { useFormFields } from '../hooks/useFormField'
import { useEquipment } from '../hooks/useEquipment'
import { useCheckout } from '../hooks/useCheckout'
import { useCheckin } from '../hooks/useCheckin'
import { useResident } from '../hooks/useResident'
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react'
import PageLayout from '../Components/PageLayout'
import ActionTable, { type Column, type Tab } from '../Components/ActionTable'
import type { Equipment } from '../api/types'

interface EquipmentRow extends Equipment {
  id: number
  daysOut: number | null
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

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
}

const calculateDaysOut = (checkoutTime: string | undefined): number | null => {
  if (!checkoutTime) return null
  const checkout = new Date(checkoutTime)
  const now = new Date()
  const diff = now.getTime() - checkout.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function EquipmentCheckOut() {
  const [activeTab, setActiveTab] = useState<Tab>('Equipment')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { equipment, available, refetch } = useEquipment()
  const { checkout, loading: checkoutLoading } = useCheckout()
  const { checkin } = useCheckin()
  const { resident, lookup } = useResident()

  const { form, setForm, setField } = useFormFields<CheckoutForm>({
    bannerId: '', residentName: '', phoneNumber: '',
    equipment1: '', equipment2: '', equipment3: '',
  })

  const rows: EquipmentRow[] = equipment.map(eq => ({
    ...eq,
    id: eq.equipmentID || 0,
    daysOut: calculateDaysOut(eq.checkoutTime),
    available: !eq.currentOwner,
  }))

  const handleBannerBlur = async () => {
    if (!form.bannerId || form.bannerId.length < 5) return
    setError(null)
    await lookup(form.bannerId)
    if (resident) {
      setForm({
        ...form,
        residentName: `${resident.lastName}, ${resident.firstName}`,
        phoneNumber: resident.phoneNumber || '',
      })
    }
  }

  const handleCheckout = async () => {
    if (!form.bannerId || !form.equipment1) {
      setError('Banner ID and at least one equipment item required')
      return
    }
    setError(null)
    setSuccess(null)
    try {
      const equipmentIds = [form.equipment1, form.equipment2, form.equipment3].filter(Boolean)
      for (const eqId of equipmentIds) {
        await checkout(Number(eqId), form.bannerId)
      }
      setSuccess(`Checked out ${equipmentIds.length} item(s) successfully`)
      setForm({
        ...form,
        bannerId: '', residentName: '', phoneNumber: '',
        equipment1: '', equipment2: '', equipment3: '',
      })
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    }
  }

  const handleCheckIn = async (row: EquipmentRow) => {
    if (!row.equipmentID) return
    setError(null)
    setSuccess(null)
    try {
      await checkin(row.equipmentID)
      setSuccess('Equipment checked in successfully')
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed')
    }
  }

  const columns: Column<EquipmentRow>[] = [
    { key: 'type', label: 'Equipment', sortable: true },
    { 
      key: 'checkoutTime', 
      label: 'Date Out',
      render: (r) => formatDate(r.checkoutTime),
    },
    { key: 'borrowerName', label: 'Borrower' },
    { key: 'borrowerBannerID', label: 'Banner ID' },
    { 
      key: 'daysOut', 
      label: 'Days Out',
      render: (r) => r.daysOut ?? '',
    },
    { key: 'borrowerPhone', label: 'Phone #' },
    { 
      key: 'available', 
      label: 'Status',
      render: (r) => r.available 
        ? <IconCheck size={16} color="green" />
        : <IconX size={16} color="red" />
    },
  ]

  const actionButtons = [
    {
      label: 'Check In',
      onClick: (row: EquipmentRow) => handleCheckIn(row),
      disabled: (row: EquipmentRow) => row.available,
      variant: 'light' as const,
      color: 'green',
    },
  ]

  const equipmentOptions = available.map(eq => ({
    value: String(eq.equipmentID),
    label: `${eq.type}${eq.description ? ` - ${eq.description}` : ''}`,
  }))

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {(error || success) && (
        <Alert 
          icon={error ? <IconAlertCircle size={16} /> : <IconCheck size={16} />}
          color={error ? 'red' : 'green'} 
          mb="md"
          withCloseButton
          onClose={() => { setError(null); setSuccess(null); }}
        >
          {error || success}
        </Alert>
      )}

      <Paper withBorder shadow="xs" p="xl" radius="md" mb="lg">
        <Title order={4} mb="lg">Equipment Check Out</Title>
        <Stack gap="md">
          <SimpleGrid cols={3} spacing="md">
            <TextInput
              label="Banner ID"
              description="Please swipe the resident's badge"
              placeholder="Banner ID"
              value={form.bannerId}
              onChange={setField('bannerId')}
              onBlur={handleBannerBlur}
            />
            <TextInput
              label="Resident Name"
              description="Autofilled after swiping badge"
              placeholder="Smith, John"
              value={form.residentName}
              onChange={setField('residentName')}
              readOnly
            />
            <TextInput
              label="Resident Phone"
              description="Autofilled after swiping badge"
              placeholder="123-456-7890"
              value={form.phoneNumber}
              onChange={setField('phoneNumber')}
              readOnly
            />
          </SimpleGrid>

          <Stack gap={4}>
            <Text size="sm" fw={600}>Equipment Selection</Text>
            <Text size="xs" c="dimmed">Select equipment to check out to resident.</Text>
            <SimpleGrid cols={3} spacing="md">
              <Select
                placeholder="Select equipment"
                data={equipmentOptions}
                value={form.equipment1}
                onChange={(v) => setField('equipment1')(v as any)}
                searchable
                clearable
              />
              <Select
                placeholder="Select equipment"
                data={equipmentOptions}
                value={form.equipment2}
                onChange={(v) => setField('equipment2')(v as any)}
                searchable
                clearable
              />
              <Select
                placeholder="Select equipment"
                data={equipmentOptions}
                value={form.equipment3}
                onChange={(v) => setField('equipment3')(v as any)}
                searchable
                clearable
              />
            </SimpleGrid>
          </Stack>

          <Button 
            onClick={handleCheckout} 
            loading={checkoutLoading}
            disabled={!form.bannerId || !form.equipment1}
            w={200}
          >
            Borrow Equipment
          </Button>
        </Stack>
      </Paper>

      <Stack gap="sm">
        <Title order={3}>Inventory</Title>
        
        <ActionTable
          data={rows}
          columns={columns}
          searchPlaceholder="Search equipment or borrower"
          searchableFields={['type', 'borrowerName', 'borrowerBannerID']}
          itemsPerPage={10}
          emptyMessage="No equipment in inventory"
          actionButtons={actionButtons}
        />
      </Stack>
    </PageLayout>
  )
}