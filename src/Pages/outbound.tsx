import { useState, useEffect } from 'react'
import {
  Button, Paper, Title, Text, Group, Badge, Stack,
  TextInput, ActionIcon, Tooltip, Loader, Center, Box, SegmentedControl,
} from '@mantine/core'
import {
  IconSearch, IconPackage, IconCheck, IconRefresh, IconX, IconMail, IconMailOff, IconArrowForwardUp,
} from '@tabler/icons-react'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import ActionTable, { type Column } from '../Components/ActionTable'
import { getAllPackages, pickupPackage, getAllForwardPackages, pickupForwardPackage } from '../api/client'

interface PackageRow {
  uniqueID: number
  owner: string
  trackingID: string
  receivedDate: string
  pickedUp: boolean
  emailSent: boolean
  type: string
  firstName: string
  lastName: string
  phoneNumber: string
  roomID: string
  building: string
}

interface ForwardRow {
  uniqueID: number
  owner: string
  building: string
  description: string
  trackingID: string
  address: string
  receivedDate: string
  emailSent: boolean
  pickedUp: boolean
  reason: string
  instructions: string
  worker: string
  workerFirstName: string
  workerLastName: string
}

export default function ResidenceLifeOutbound() {
  const [activeTab, setActiveTab] = useState<Tab>('Outbound')
  const [packages, setPackages] = useState<PackageRow[]>([])
  const [forwardPackages, setForwardPackages] = useState<ForwardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [pickingUp, setPickingUp] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'pickedUp'>('all')
  const [packageType, setPackageType] = useState<'standard' | 'forwarded'>('standard')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [stdData, fwdData] = await Promise.all([
        getAllPackages(),
        getAllForwardPackages()
      ])
      setPackages(stdData)
      setForwardPackages(fwdData)
    } catch (err: any) {
      setError(err.message || 'Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePickup = async (pkg: PackageRow) => {
    setPickingUp(pkg.uniqueID)
    try {
      await pickupPackage(pkg.uniqueID)
      setPackages(prev =>
        prev.map(p => p.uniqueID === pkg.uniqueID ? { ...p, pickedUp: true } : p)
      )
    } catch (err: any) {
      setError(err.message || 'Failed to mark as picked up')
    } finally {
      setPickingUp(null)
    }
  }

  const handleForwardPickup = async (pkg: ForwardRow) => {
    setPickingUp(pkg.uniqueID)
    try {
      await pickupForwardPackage(pkg.uniqueID)
      setForwardPackages(prev =>
        prev.map(p => p.uniqueID === pkg.uniqueID ? { ...p, pickedUp: true } : p)
      )
    } catch (err: any) {
      setError(err.message || 'Failed to mark forward package as picked up')
    } finally {
      setPickingUp(null)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const filteredStd = packages.filter(pkg => {
    const matchesSearch =
      !search ||
      `${pkg.firstName} ${pkg.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      (pkg.trackingID || '').toLowerCase().includes(search.toLowerCase()) ||
      (pkg.building || '').toLowerCase().includes(search.toLowerCase()) ||
      (pkg.type || '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && !pkg.pickedUp) ||
      (filterStatus === 'pickedUp' && pkg.pickedUp)

    return matchesSearch && matchesStatus
  })

  const filteredFwd = forwardPackages.filter(pkg => {
    const matchesSearch =
      !search ||
      (pkg.owner || '').toLowerCase().includes(search.toLowerCase()) ||
      (pkg.trackingID || '').toLowerCase().includes(search.toLowerCase()) ||
      (pkg.building || '').toLowerCase().includes(search.toLowerCase()) ||
      (pkg.description || '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && !pkg.pickedUp) ||
      (filterStatus === 'pickedUp' && pkg.pickedUp)

    return matchesSearch && matchesStatus
  })

  const currentData = packageType === 'standard' ? filteredStd : filteredFwd
  const pendingCount = (packageType === 'standard' ? packages : forwardPackages).filter(p => !p.pickedUp).length
  const pickedUpCount = (packageType === 'standard' ? packages : forwardPackages).filter(p => p.pickedUp).length
  const totalCount = (packageType === 'standard' ? packages : forwardPackages).length

  const stdColumns: Column<PackageRow>[] = [
    {
      key: 'uniqueID',
      label: 'ID',
      sortable: true,
      render: (pkg) => (
        <Text size="sm" fw={600} c="dimmed">#{pkg.uniqueID}</Text>
      ),
    },
    {
      key: 'firstName',
      label: 'Resident',
      sortable: true,
      render: (pkg) => (
        <Stack gap={2}>
          <Text size="sm" fw={600}>{pkg.firstName} {pkg.lastName}</Text>
          {pkg.building && (
            <Text size="xs" c="dimmed">{pkg.building}{pkg.roomID ? ` · ${pkg.roomID}` : ''}</Text>
          )}
        </Stack>
      ),
    },
    {
      key: 'trackingID',
      label: 'Tracking #',
      sortable: true,
      render: (pkg) => (
        <Text size="sm" ff="monospace">{pkg.trackingID || '—'}</Text>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (pkg) => (
        <Text size="sm">{pkg.type || '—'}</Text>
      ),
    },
    {
      key: 'receivedDate',
      label: 'Received',
      sortable: true,
      render: (pkg) => (
        <Text size="sm">{formatDate(pkg.receivedDate)}</Text>
      ),
    },
    {
      key: 'pickedUp',
      label: 'Status',
      sortable: true,
      render: (pkg) => (
        <Badge
          color={pkg.pickedUp ? 'teal' : 'orange'}
          variant="light"
          leftSection={pkg.pickedUp ? <IconCheck size={12} /> : <IconPackage size={12} />}
        >
          {pkg.pickedUp ? 'Picked Up' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'emailSent',
      label: 'Email',
      sortable: true,
      render: (pkg) => (
        <Badge
          color={pkg.emailSent ? 'blue' : 'gray'}
          variant="light"
          leftSection={pkg.emailSent ? <IconMail size={12} /> : <IconMailOff size={12} />}
        >
          {pkg.emailSent ? 'Sent' : 'Not Sent'}
        </Badge>
      ),
    },
    {
      key: 'uniqueID' as any,
      label: 'Action',
      render: (pkg) =>
        pkg.pickedUp ? (
          <Text size="xs" c="dimmed">Done</Text>
        ) : (
          <Button
            size="xs"
            color="brand-purple"
            loading={pickingUp === pkg.uniqueID}
            leftSection={<IconCheck size={14} />}
            onClick={() => handlePickup(pkg)}
          >
            Pick Up
          </Button>
        ),
    },
  ]

  const fwdColumns: Column<ForwardRow>[] = [
    {
      key: 'uniqueID',
      label: 'ID',
      sortable: true,
      render: (pkg) => (
        <Text size="sm" fw={600} c="dimmed">FW{pkg.uniqueID}</Text>
      ),
    },
    {
      key: 'owner',
      label: 'Resident',
      sortable: true,
      render: (pkg) => (
        <Stack gap={2}>
          <Text size="sm" fw={600}>{pkg.owner}</Text>
          {pkg.building && (
            <Text size="xs" c="dimmed">{pkg.building}</Text>
          )}
        </Stack>
      ),
    },
    {
      key: 'trackingID',
      label: 'Tracking #',
      sortable: true,
      render: (pkg) => (
        <Text size="sm" ff="monospace">{pkg.trackingID || '—'}</Text>
      ),
    },
    {
      key: 'description',
      label: 'Desc',
      sortable: true,
      render: (pkg) => (
        <Text size="sm">{pkg.description || '—'}</Text>
      ),
    },

    {
      key: 'reason',
      label: 'Reason',
      sortable: true,
      render: (pkg) => (
        <Text size="sm">{pkg.reason}</Text>
      ),
    },
    {
      key: 'instructions',
      label: 'Inst',
      sortable: true,
      render: (pkg) => (
        <Text size="sm">{pkg.instructions || '—'}</Text>
      ),
    },
    {
      key: 'workerFirstName',
      label: 'Staff',
      sortable: true,
      render: (pkg) => (
        <Text size="sm">{pkg.workerFirstName ? `${pkg.workerFirstName} ${pkg.workerLastName}` : (pkg.worker || '—')}</Text>
      ),
    },
    {
      key: 'receivedDate',
      label: 'Received',
      sortable: true,
      render: (pkg) => (
        <Text size="sm">{formatDate(pkg.receivedDate)}</Text>
      ),
    },
    {
      key: 'pickedUp',
      label: 'Status',
      sortable: true,
      render: (pkg) => (
        <Badge
          color={pkg.pickedUp ? 'teal' : 'orange'}
          variant="light"
          leftSection={pkg.pickedUp ? <IconCheck size={12} /> : <IconArrowForwardUp size={12} />}
        >
          {pkg.pickedUp ? 'Picked Up' : 'Pending Forward'}
        </Badge>
      ),
    },
    {
      key: 'uniqueID' as any,
      label: 'Action',
      render: (pkg) =>
        pkg.pickedUp ? (
          <Text size="xs" c="dimmed">Done</Text>
        ) : (
          <Button
            size="xs"
            color="brand-purple"
            loading={pickingUp === pkg.uniqueID}
            leftSection={<IconCheck size={14} />}
            onClick={() => handleForwardPickup(pkg)}
          >
            Pick Up
          </Button>
        ),
    },
  ]

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Group justify="space-between" mb="lg">
        <Title order={3}>Outbound Packages</Title>
        <SegmentedControl
          value={packageType}
          onChange={(val: any) => setPackageType(val)}
          data={[
            { label: 'Standard Packages', value: 'standard' },
            { label: 'Forwarded Packages', value: 'forwarded' },
          ]}
        />
      </Group>

      {/* Summary Cards */}
      <Group mb="lg" gap="md">
        <Paper withBorder p="md" radius="md" style={{ flex: 1 }}>
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="xs" tt="uppercase" fw={600} c="dimmed">Total {packageType === 'standard' ? 'Packages' : 'Forwards'}</Text>
              <Text size="xl" fw={800}>{totalCount}</Text>
            </Stack>
            <Box
              w={44} h={44}
              style={{
                borderRadius: '50%',
                background: 'var(--mantine-color-brand-purple-1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <IconPackage size={22} color="#FFFFFF" />
            </Box>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="md" style={{ flex: 1 }}>
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="xs" tt="uppercase" fw={600} c="dimmed">Pending Pickup/Forward</Text>
              <Text size="xl" fw={800} c="orange">{pendingCount}</Text>
            </Stack>
            <Box
              w={44} h={44}
              style={{
                borderRadius: '50%',
                background: 'var(--mantine-color-orange-1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <IconPackage size={22} color="var(--mantine-color-orange-7)" />
            </Box>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="md" style={{ flex: 1 }}>
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="xs" tt="uppercase" fw={600} c="dimmed">Picked Up</Text>
              <Text size="xl" fw={800} c="teal">{pickedUpCount}</Text>
            </Stack>
            <Box
              w={44} h={44}
              style={{
                borderRadius: '50%',
                background: 'var(--mantine-color-teal-1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <IconCheck size={22} color="var(--mantine-color-teal-7)" />
            </Box>
          </Group>
        </Paper>
      </Group>

      <Paper withBorder shadow="xs" p="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>{packageType === 'standard' ? 'Standard Package Log' : 'Forwarded Package Log'}</Title>
          <Tooltip label="Refresh">
            <ActionIcon variant="light" onClick={fetchData} loading={loading}>
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>

        {/* Filters */}
        <Group mb="md" gap="sm">
          <TextInput
            placeholder="Search by name, tracking, building..."
            leftSection={<IconSearch size={14} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            rightSection={search ? (
              <ActionIcon variant="transparent" size="xs" onClick={() => setSearch('')}>
                <IconX size={12} />
              </ActionIcon>
            ) : null}
            style={{ flex: 1 }}
          />
          <Group gap="xs">
            {(['all', 'pending', 'pickedUp'] as const).map(f => (
              <Button
                key={f}
                size="xs"
                variant={filterStatus === f ? 'filled' : 'light'}
                color={f === 'pickedUp' ? 'teal' : f === 'pending' ? 'orange' : 'gray'}
                onClick={() => setFilterStatus(f)}
              >
                {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Picked Up'}
              </Button>
            ))}
          </Group>
        </Group>

        {loading ? (
          <Center py="xl">
            <Stack align="center" gap="xs">
              <Loader size="md" />
              <Text size="sm" c="dimmed">Loading packages...</Text>
            </Stack>
          </Center>
        ) : error ? (
          <Center py="xl">
            <Text c="red" size="sm">{error}</Text>
          </Center>
        ) : (
          <ActionTable
            data={currentData as any}
            columns={(packageType === 'standard' ? stdColumns : fwdColumns) as any}
            searchableFields={[]}
          />
        )}
      </Paper>
    </PageLayout>
  )
}