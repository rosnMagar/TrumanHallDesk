import { useEffect, useMemo, useState } from 'react'
import {
  Group, Button, Text, Paper, Title,
  Stack, Alert,
} from '@mantine/core'
import { IconLogin, IconLogout, IconClock } from '@tabler/icons-react'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { useTimeclock } from '../hooks/useTimeclock'

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

function formatDateLong(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatPunchRow(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export default function Timeclock() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [now, setNow] = useState(() => new Date())
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const { punches, loading, error, punch } = useTimeclock()

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const isClockedIn = useMemo(() => {
    if (punches.length === 0) return false
    const sorted = [...punches].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    return sorted[0].action === 'in'
  }, [punches])

  const handlePunch = async (action: 'in' | 'out') => {
    setMessage(null)
    const result = await punch(action)
    if (result.success) {
      const timestamp = result.timestamp ? ` at ${formatPunchRow(result.timestamp)}` : ''
      setMessage({ type: 'ok', text: `${result.message}${timestamp}` })
    } else {
      setMessage({ type: 'err', text: result.message })
    }
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Stack maw={720} mx="auto" gap="lg">

        {/* Live Clock */}
        <Paper withBorder shadow="xs" p="xl" radius="md">
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Group gap="sm">
              <IconClock size={28} color="var(--mantine-color-grape-6)" stroke={1.5} />
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Current time
                </Text>
                <Title order={2} c="dark.7" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatTime(now)}
                </Title>
                <Text size="sm" c="dimmed">
                  {formatDateLong(now)}
                </Text>
              </div>
            </Group>
            <Text size="sm" c={isClockedIn ? 'teal' : 'dimmed'} fw={500}>
              {isClockedIn ? 'Clocked in' : 'Clocked out'}
            </Text>
          </Group>
        </Paper>

        {/* Punch Form */}
        <Paper withBorder shadow="xs" p="xl" radius="md">
          <Title order={4} mb="lg">Timeclock</Title>
          <Stack gap="md">
            {error ? (
              <Alert color="red" title="Error">
                {error}
              </Alert>
            ) : null}

            {message ? (
              <Alert
                color={message.type === 'ok' ? 'teal' : 'red'}
                title={message.type === 'ok' ? 'Recorded' : 'Cannot punch'}
              >
                {message.text}
              </Alert>
            ) : null}

            <Group grow>
              <Button
                color="teal"
                leftSection={<IconLogin size={18} />}
                onClick={() => handlePunch('in')}
                disabled={isClockedIn || loading}
                loading={loading}
              >
                Clock In
              </Button>
              <Button
                color="red"
                variant="light"
                leftSection={<IconLogout size={18} />}
                onClick={() => handlePunch('out')}
                disabled={!isClockedIn || loading}
                loading={loading}
              >
                Clock Out
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* My Punches */}
        <Paper withBorder shadow="xs" p="xl" radius="md">
          <Title order={5} mb="md">My Punches Today</Title>
          {punches.length === 0 ? (
            <Text size="sm" c="dimmed">No punches recorded today.</Text>
          ) : (
            <Stack gap="xs">
              {punches.map((p) => (
                <Group key={p.id} justify="space-between">
                  <Text size="sm" fw={500}>
                    {p.action === 'in' ? 'Clocked in' : 'Clocked out'}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatPunchRow(p.at)}
                  </Text>
                </Group>
              ))}
            </Stack>
          )}
        </Paper>

      </Stack>
    </PageLayout>
  )
}