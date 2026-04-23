import { useState } from 'react'
import {
  AppShell, Group, Button, Text, TextInput, Paper, Title,
  Stack,
} from '@mantine/core'
import SiteHeader, { type Tab } from '../Components/SiteHeader'

export default function Timeclock() {
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

      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} />

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
