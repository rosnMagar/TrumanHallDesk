import { useState } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title, Stack,
} from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'

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
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
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
          <Group justify="space-between" align="center">
            <Text size="sm" c="dimmed" style={{ minWidth: 220 }}>
              {isClockedIn ? 'You are currently clocked in' : 'You are currently clocked out'}
            </Text>
            <Button
              color="brand-purple"
              onClick={handleClockAction}
              disabled={!bannerId}
            >
              {isClockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </PageLayout>
  )
}