import { useState } from 'react'
import { Title, Stack, Alert, Button, Group } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useEquipment } from '../hooks/useEquipment'
import { useCheckin } from '../hooks/useCheckin'
import { IconCheck, IconX, IconAlertCircle, IconList } from '@tabler/icons-react'
import PageLayout from '../Components/PageLayout'
import ActionTable, { type Column, type Tab } from '../Components/ActionTable'
import type { Equipment } from '../api/types'

interface EquipmentRow extends Equipment {
  id: number
  daysOut: number | null
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

export default function EquipmentInventory() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Equipment')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { equipment, refetch } = useEquipment()
  const { checkin } = useCheckin()

  const rows: EquipmentRow[] = equipment.map(eq => ({
    ...eq,
    id: eq.equipmentID || 0,
    daysOut: calculateDaysOut(eq.checkoutTime),
  }))

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
    { key: 'description', label: 'Description' },
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
    { 
      key: 'checkedOut', 
      label: 'Status',
      render: (r) => r.checkedOut === 'Y' 
        ? <IconX size={16} color="red" />
        : <IconCheck size={16} color="green" />
    },
  ]

  const actionButtons = [
    {
      label: 'Check In',
      onClick: (row: EquipmentRow) => handleCheckIn(row),
      disabled: (row: EquipmentRow) => row.checkedOut !== 'Y',
      variant: 'light' as const,
      color: 'green',
    },
  ]

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

      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Equipment Inventory</Title>
          <Button
            color="brand-blue"
            variant="light"
            leftSection={<IconList size={18} />}
            onClick={() => navigate('/equipment')}
          >
            Check Out Equipment
          </Button>
        </Group>
        
        <ActionTable
          data={rows}
          columns={columns}
          searchPlaceholder="Search equipment or borrower"
          searchableFields={['type', 'description', 'borrowerName', 'borrowerBannerID']}
          itemsPerPage={10}
          emptyMessage="No equipment in inventory"
          actionButtons={actionButtons}
        />
      </Stack>
    </PageLayout>
  )
}
