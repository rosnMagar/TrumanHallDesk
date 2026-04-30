import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  Stack, Loader, Modal, SimpleGrid, Badge, Box,
} from '@mantine/core'
import { IconSearch, IconPackage, IconPrinter, IconUser, IconCheck } from '@tabler/icons-react'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { searchResidents, createNewPackage, type ResidentSearchResult } from '../api/client'

export default function ResidenceLife() {
  const [activeTab, setActiveTab] = useState<Tab>('Inbound')

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ResidentSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Selected resident
  const [selectedResident, setSelectedResident] = useState<ResidentSearchResult | null>(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<{ packageID: number; staffName: string } | null>(null)

  // Debounced search
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    setSearching(true)
    try {
      const results = await searchResidents(query)
      setSearchResults(results)
      setShowDropdown(results.length > 0)
    } catch {
      setSearchResults([])
      setShowDropdown(false)
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (searchQuery.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchQuery, performSearch])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelectResident = (resident: ResidentSearchResult) => {
    setSelectedResident(resident)
    setSearchQuery('')
    setShowDropdown(false)
    setSearchResults([])
  }

  const handleOpenModal = () => {
    setDescription('')
    setTrackingNumber('')
    setSubmitSuccess(null)
    setModalOpen(true)
  }

  const handleSubmitPackage = async () => {
    if (!selectedResident) return
    setSubmitting(true)
    try {
      const result = await createNewPackage({
        ownerBannerID: selectedResident.bannerID,
        trackingID: trackingNumber.trim() || 'N/A',
        type: description.trim() || null as unknown as string,
      })
      setSubmitSuccess({ packageID: result.packageID, staffName: result.staffName })
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const now = new Date()
  const dateTimeStr = now.toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <Title order={4} mb="lg">Package Log-In</Title>

        {/* Search Input */}
        <div ref={dropdownRef} style={{ position: 'relative', maxWidth: 500 }}>
          <TextInput
            label="Search Resident"
            description="Type at least 2 characters of the resident's last name"
            placeholder="Last name..."
            leftSection={searching ? <Loader size={14} /> : <IconSearch size={14} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />

          {/* Dropdown results */}
          {showDropdown && (
            <Paper
              withBorder
              shadow="md"
              radius="md"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 100,
                maxHeight: 280,
                overflowY: 'auto',
              }}
            >
              {searchResults.map((r) => (
                <Box
                  key={r.bannerID}
                  px="sm"
                  py="xs"
                  style={{
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    transition: 'background 0.1s',
                  }}
                  onMouseDown={() => handleSelectResident(r)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--mantine-color-gray-1)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <Text size="sm" fw={500}>
                    {r.lastName}, {r.firstName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {r.buildingName || r.building} {r.roomID}
                  </Text>
                </Box>
              ))}
            </Paper>
          )}
        </div>

        {/* Selected Resident Info */}
        {selectedResident && (
          <Paper withBorder shadow="xs" p="lg" radius="md" mt="lg" bg="gray.0">
            <Group justify="space-between" align="flex-start" mb="md">
              <Group gap="sm">
                <Box
                  w={48} h={48}
                  style={{
                    borderRadius: '50%',
                    background: 'var(--mantine-color-brand-purple-6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <IconUser size={24} color="white" />
                </Box>
                <div>
                  <Text fw={700} size="lg">{selectedResident.firstName} {selectedResident.lastName}</Text>
                  <Text size="sm" c="dimmed">Banner ID: {selectedResident.bannerID}</Text>
                </div>
              </Group>
              <Badge color="brand-purple" variant="light" size="lg">Resident</Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Paper withBorder p="md" radius="md">
                <Text size="xs" tt="uppercase" c="dimmed" fw={600} mb={4}>On-Campus Address</Text>
                <Text size="sm" fw={500}>
                  {selectedResident.buildingName || selectedResident.building}
                </Text>
                <Text size="sm" c="dimmed">Room {selectedResident.roomID}</Text>
              </Paper>
              <Paper withBorder p="md" radius="md">
                <Text size="xs" tt="uppercase" c="dimmed" fw={600} mb={4}>Off-Campus Address</Text>
                <Text size="sm" fw={500}>
                  {selectedResident.homeAddress || 'Not on file'}
                </Text>
              </Paper>
              <Paper withBorder p="md" radius="md">
                <Text size="xs" tt="uppercase" c="dimmed" fw={600} mb={4}>Email</Text>
                <Text size="sm">{selectedResident.email || 'N/A'}</Text>
              </Paper>
              <Paper withBorder p="md" radius="md">
                <Text size="xs" tt="uppercase" c="dimmed" fw={600} mb={4}>Phone</Text>
                <Text size="sm">{selectedResident.phoneNumber || 'N/A'}</Text>
              </Paper>
            </SimpleGrid>

            <Group mt="lg" justify="flex-end">
              <Button
                variant="default"
                leftSection={<IconPrinter size={16} />}
                onClick={() => { /* no-op for now */ }}
              >
                Print
              </Button>
              <Button
                color="brand-blue"
                leftSection={<IconPackage size={16} />}
                onClick={handleOpenModal}
              >
                Add Package
              </Button>
            </Group>
          </Paper>
        )}
      </Paper>

      {/* Add Package Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log New Package"
        centered
        size="lg"
      >
        {submitSuccess ? (
          <Stack align="center" gap="md" py="xl">
            <Box
              w={64} h={64}
              style={{
                borderRadius: '50%',
                background: 'var(--mantine-color-teal-1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <IconCheck size={32} color="var(--mantine-color-teal-7)" />
            </Box>
            <Title order={4} c="teal.7">Package Logged Successfully!</Title>
            <Text size="sm" c="dimmed">Package ID: <strong>{submitSuccess.packageID}</strong></Text>
            <Text size="sm" c="dimmed">Staff: {submitSuccess.staffName}</Text>
            <Button color="brand-blue" onClick={() => { setModalOpen(false); setSubmitSuccess(null) }}>
              Done
            </Button>
          </Stack>
        ) : (
          <Stack gap="md">
            <SimpleGrid cols={2} spacing="md">
              <TextInput label="Building" value={selectedResident?.buildingName || selectedResident?.building || ''} readOnly />
              <TextInput label="Room" value={selectedResident?.roomID || ''} readOnly />
            </SimpleGrid>
            <TextInput
              label="Name"
              value={selectedResident ? `${selectedResident.firstName} ${selectedResident.lastName}` : ''}
              readOnly
            />
            <SimpleGrid cols={2} spacing="md">
              <TextInput label="Email" value={selectedResident?.email || ''} readOnly />
              <TextInput label="Banner ID" value={selectedResident?.bannerID || ''} readOnly />
            </SimpleGrid>
            <TextInput
              label="Description of Package"
              placeholder="e.g. White Amazon Mailer - B"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
            <TextInput
              label="Scan in Tracking Number"
              description="Type N/A if package does not have a tracking number"
              placeholder="Tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.currentTarget.value)}
            />
            <SimpleGrid cols={2} spacing="md">
              <TextInput label="Staff" value="(auto-detected)" readOnly />
              <TextInput label="Date & Time" value={dateTimeStr} readOnly />
            </SimpleGrid>
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                color="brand-blue"
                loading={submitting}
                onClick={handleSubmitPackage}
                disabled={!trackingNumber.trim()}
              >
                Submit
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </PageLayout>
  )
}