import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppShell, Group, Button, Text, TextInput, Paper, Title,
  Stack, Box,
} from '@mantine/core'
import { IconDeviceDesktop } from '@tabler/icons-react'

type Tab = 'Inbound' | 'Outbound' | 'Lock-out' | 'Equipment' | 'Timeclock'

const TABS: Tab[] = ['Inbound', 'Outbound', 'Lock-out', 'Equipment', 'Timeclock']

export default function Timeclock() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [bannerId, setBannerId] = useState('')
  const [isClockedIn, setIsClockedIn] = useState(false)

  const handleClockAction = () => {
    const action = isClockedIn ? 'Clock Out' : 'Clock In'
    alert(`${action} - Banner ID: ${bannerId}`)
    setIsClockedIn(!isClockedIn)
    setBannerId('')
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 80 }} padding={0}>

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
                  if (tab === 'Equipment') navigate('/equipment')
                  if (tab === 'Lock-out') navigate('/lockout')
                  if (tab === 'Timeclock') navigate('/timeclock')
                }}
              >
                {tab}
              </Button>
            ))}
          </Group>
          <Group gap="xs">
            <Text size="sm">BNB Desk</Text>
            <Box w={32} h={32} style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-grape-6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconDeviceDesktop size={16} color="white" />
            </Box>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={600} mx="auto" gap="lg">
          <Paper withBorder shadow="xs" p="xl" radius="md">
            <Title order={4} mb="lg">Timeclock</Title>
            <Stack gap="md">
              <TextInput
                label="Banner ID"
                description="Enter your 9-digit Banner ID"
                placeholder="123456789"
                value={bannerId}
                onChange={(e) => setBannerId(e.target.value)}
              />
              <Group justify="flex-end">
                <Button 
                  color="grape" 
                  onClick={handleClockAction}
                  disabled={!bannerId}
                >
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </AppShell.Main>

      <AppShell.Footer bg="gray.2" p="md">
        <Group justify="center">
          <Text size="sm" c="dimmed">
            {isClockedIn ? 'You are currently clocked in' : 'You are currently clocked out'}
          </Text>
        </Group>
      </AppShell.Footer>

    </AppShell>
  )
}
