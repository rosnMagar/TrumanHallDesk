import { useState } from 'react'
import {
  AppShell, Group, Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack, Anchor, Box, List,
} from '@mantine/core'
import { IconDeviceDesktop } from '@tabler/icons-react'
import SiteFooter from '../Components/SiteFooter'
import { useNavigate } from 'react-router-dom'

type Tab = 'Inbound' | 'Outbound' | 'Lock-out' | 'Equipment' | 'Timeclock'
const TABS: Tab[] = ['Inbound', 'Outbound', 'Lock-out', 'Equipment', 'Timeclock']

interface LockoutForm {
  bannerId: string
  phoneNumber: string
  keyNumber: string
}

export default function ResidentLockout() {
  const [activeTab, setActiveTab] = useState<Tab>('Lock-out')
  const navigate = useNavigate()

  const [form, setForm] = useState<LockoutForm>({
    bannerId: '',
    phoneNumber: '',
    keyNumber: '',
  })

  const setField = (f: keyof LockoutForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = () => {
    alert(`Lockout submitted!\nBanner ID: ${form.bannerId}\nPhone: ${form.phoneNumber}\nKey: ${form.keyNumber}`)
    setForm({ bannerId: '', phoneNumber: '', keyNumber: '' })
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>

      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text fw={700} size="xl" c="grape">Residence Life</Text>
          <Group gap="xs">
            {TABS.map(tab => (
              <Button
                key={tab}
                size="xs"
                variant={activeTab === tab ? 'filled' : 'default'}
                color="grape"
                onClick={() => {
                  setActiveTab(tab)

                  if (tab === 'Inbound') navigate('/')
                  if (tab === 'Outbound') navigate('/outbound')
                  if (tab === 'Lock-out') navigate('/lockout')
                  if (tab === 'Equipment') navigate('/equipment')
                  if (tab === 'Timeclock') navigate('/timeclock')
                }}
              >
                {tab}
              </Button>
            ))}
          </Group>
          <Group gap="xs">
            <Text size="sm">BNB Desk</Text>
            <Box
              w={32} h={32}
              style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-grape-6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IconDeviceDesktop size={16} color="white" />
            </Box>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Main */}
      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">

          <Paper withBorder shadow="xs" p="xl" radius="md">
            <Title order={4} mb="lg">Resident Lockout</Title>
            <SimpleGrid cols={2} spacing="xl">

              {/* Left - Form Fields */}
              <Stack gap="md">
                <TextInput
                  label="Banner ID"
                  description="Swipe the resident's badge or type their ID number"
                  placeholder="Banner ID"
                  value={form.bannerId}
                  onChange={setField('bannerId')}
                />
                <TextInput
                  label="Phone Number"
                  description="I don't think this is needed for lockouts??? - James"
                  placeholder="Resident Phone Number"
                  value={form.phoneNumber}
                  onChange={setField('phoneNumber')}
                />
                <TextInput
                  label="Key Number"
                  description="Enter the code engraved on the key"
                  placeholder="304"
                  value={form.keyNumber}
                  onChange={setField('keyNumber')}
                />
              </Stack>

              {/* Right - Instructions Box */}
              <Paper withBorder p="md" radius="md" bg="gray.0">
                <Text fw={600} size="sm" mb="sm">Desk Attendant Instructions</Text>
                <List size="sm" c="dimmed" spacing={4}>
                  <List.Item>Please inform the resident they will be charged $10</List.Item>
                  <List.Item>Swipe the resident's card</List.Item>
                  <List.Item>Unlock the key box in the closet</List.Item>
                  <List.Item>Get the key and enter the code in the Key Number box</List.Item>
                </List>
              </Paper>

            </SimpleGrid>
          </Paper>

          {/* Submit Button */}
          <Group justify="center">
            <Button color="grape" px="xl" onClick={handleSubmit}>
              Submit Lockout
            </Button>
          </Group>

        </Stack>
      </AppShell.Main>

      {/* Footer */}
      <SiteFooter />

    </AppShell>
  )
}