import { useState } from 'react'
import {
  Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack, Select, Alert, Group, Divider, Modal, Image, Box,
} from '@mantine/core'
import { useFormFields } from '../hooks/useFormField'
import { useEquipment } from '../hooks/useEquipment'
import { useCheckout } from '../hooks/useCheckout'
import { getUser, createEquipment } from '../api/client'
import { IconCheck, IconAlertCircle, IconPlus, IconList } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../Components/PageLayout'
import type { Tab } from '../Components/ActionTable'

interface CheckoutForm {
  bannerId: string
  residentName: string
  phoneNumber: string
  equipment1: string
  equipment2: string
  equipment3: string
}

export default function EquipmentCheckOut() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Equipment')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newEqType, setNewEqType] = useState('')
  const [newEqDesc, setNewEqDesc] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const { available, refetch } = useEquipment()
  const { checkout, loading: checkoutLoading } = useCheckout()
  const [user, setUser] = useState<{bannerID: string; firstName: string; lastName: string; phoneNumber?: string; idPicture?: string} | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)

  const { form, setForm, setField } = useFormFields<CheckoutForm>({
    bannerId: '', residentName: '', phoneNumber: '',
    equipment1: '', equipment2: '', equipment3: '',
  })

  const handleBannerSearch = async () => {
    if (!form.bannerId || form.bannerId.length < 5) {
      setError('Please enter a valid Banner ID')
      return
    }
    setError(null)
    setSuccess(null)
    setSearchLoading(true)
    try {
      const res = await getUser(form.bannerId)
      if (res) {
        setUser(res)
        setForm(prev => ({
          ...prev,
          residentName: `${res.lastName}, ${res.firstName}`,
          phoneNumber: res.phoneNumber || '',
        }))
        setShowForm(true)
      } else {
        setError('Resident not found for this Banner ID')
      }
    } catch (err) {
      setError('Resident not found for this Banner ID')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!form.bannerId || !form.equipment1) {
      setError('At least one equipment item is required')
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
      setShowForm(false)
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    }
  }

  const handleAddEquipment = async () => {
    if (!newEqType) return
    setIsAdding(true)
    try {
      await createEquipment({ type: newEqType, description: newEqDesc })
      setSuccess('New equipment added to inventory')
      setAddModalOpen(false)
      setNewEqType('')
      setNewEqDesc('')
      refetch()
    } catch (err) {
      setError('Failed to add equipment')
    } finally {
      setIsAdding(false)
    }
  }

  const equipmentOptions = available.map(eq => ({
    value: String(eq.equipmentID),
    label: `${eq.type}${eq.description ? ` - ${eq.description}` : ''}`,
  }))

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Equipment Management</Title>
        <Button 
          variant="light" 
          leftSection={<IconList size={18} />}
          onClick={() => navigate('/equipment/inventory')}
        >
          View Inventory
        </Button>
      </Group>

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

      {!showForm ? (
        <Paper withBorder shadow="sm" p="xl" radius="md">
          <Stack align="center" gap="md">
            <Title order={4}>Resident Check Out</Title>
            <Text size="sm" c="dimmed" ta="center">Enter the user's Banner ID or swipe their badge to begin.</Text>
            <Group align="flex-end" w="100%" style={{ maxWidth: 400 }}>
              <TextInput
                label="Banner ID"
                placeholder="B00..."
                value={form.bannerId}
                onChange={setField('bannerId')}
                style={{ flex: 1 }}
                onKeyDown={(e) => e.key === 'Enter' && handleBannerSearch()}
              />
              <Button onClick={handleBannerSearch} loading={searchLoading}>Search</Button>
            </Group>
          </Stack>
        </Paper>
      ) : (
        <Paper withBorder shadow="sm" p="xl" radius="md">
          <Stack gap="xl">
            <Group justify="space-between" align="center">
              <Title order={4}>Resident Verified</Title>
              <Button variant="subtle" color="gray" size="xs" onClick={() => setShowForm(false)}>
                Change Resident
              </Button>
            </Group>

            <Group align="flex-start" gap="xl" wrap="nowrap">
              <Box style={{ flex: '0 0 30%' }}>
                <Paper withBorder p={4} radius="md" shadow="xs">
                  <Image 
                    src={user?.idPicture || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"} 
                    w="100%" 
                    h={200}
                    fit="cover"
                    radius="sm" 
                    alt="Resident ID"
                    fallbackSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                  />
                </Paper>
              </Box>

              <Stack gap="sm" style={{ flex: 1 }}>
                <Title order={3} mb={0}>{user?.firstName} {user?.lastName}</Title>
                <Divider w={100} />
                
                <Stack gap={4}>
                  <Group gap="xs">
                    <Text fw={700} size="sm" w={80}>Banner ID:</Text>
                    <Text size="sm">{user?.bannerID}</Text>
                  </Group>
                  {user?.phoneNumber && (
                    <Group gap="xs">
                      <Text fw={700} size="sm" w={80}>Phone:</Text>
                      <Text size="sm">{user?.phoneNumber}</Text>
                    </Group>
                  )}
                </Stack>
                
                <Alert color="blue" variant="light" py="xs" mt="md">
                  <Text size="xs">
                    Verified student record. Eligible to borrow equipment.
                  </Text>
                </Alert>
              </Stack>
            </Group>

            <Divider label="Select Equipment" labelPosition="center" />

            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" fw={600}>Items to Borrow</Text>
                <Button 
                  variant="subtle" 
                  size="xs" 
                  leftSection={<IconPlus size={14} />}
                  onClick={() => setAddModalOpen(true)}
                >
                  Add New Item
                </Button>
              </Group>
              
              <SimpleGrid cols={3} spacing="md">
                <Select
                  placeholder="Item 1 (Required)"
                  data={equipmentOptions}
                  value={form.equipment1}
                  onChange={(v) => setField('equipment1')(v)}
                  searchable
                  clearable
                />
                <Select
                  placeholder="Item 2 (Optional)"
                  data={equipmentOptions}
                  value={form.equipment2}
                  onChange={(v) => setField('equipment2')(v)}
                  searchable
                  clearable
                />
                <Select
                  placeholder="Item 3 (Optional)"
                  data={equipmentOptions}
                  value={form.equipment3}
                  onChange={(v) => setField('equipment3')(v)}
                  searchable
                  clearable
                />
              </SimpleGrid>
            </Stack>

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleCheckout} loading={checkoutLoading}>
                Complete Borrow
              </Button>
            </Group>
          </Stack>
        </Paper>
      )}

      <Modal 
        opened={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        title="Add New Equipment to Inventory"
        centered
      >
        <Stack gap="md">
          <TextInput 
            label="Equipment Type" 
            placeholder="e.g. Vacuum, Key, Basketball" 
            required
            value={newEqType}
            onChange={(e) => setNewEqType(e.currentTarget.value)}
          />
          <TextInput 
            label="Description/ID" 
            placeholder="e.g. Room 101, Serial #123" 
            value={newEqDesc}
            onChange={(e) => setNewEqDesc(e.currentTarget.value)}
          />
          <Button fullWidth onClick={handleAddEquipment} loading={isAdding}>
            Add to Inventory
          </Button>
        </Stack>
      </Modal>
    </PageLayout>
  )
}