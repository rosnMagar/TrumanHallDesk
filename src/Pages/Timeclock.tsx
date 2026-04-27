import { useEffect, useMemo, useState } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  Stack, Table, ScrollArea, Badge, Alert,
} from '@mantine/core'
import { IconLogin, IconLogout, IconClock } from '@tabler/icons-react'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import {
  appendPunch,
  lastActionForBanner,
  loadPunches,
  punchesOnLocalDay,
  type TimeclockPunch,
} from '../lib/timeclockLocalStore'

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
  const [bannerId, setBannerId] = useState('')
  const [now, setNow] = useState(() => new Date())
  const [punches, setPunches] = useState<TimeclockPunch[]>(() => loadPunches())
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const trimmedBanner = bannerId.trim()
  const status = useMemo(
    () => lastActionForBanner(trimmedBanner, punches),
    [trimmedBanner, punches]
  )
  const isClockedIn = status === 'in'

  const todayPunches = useMemo(
    () =>
      [...punchesOnLocalDay(punches, new Date())].sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
      ),
    [punches]
  )

  const punch = (action: 'in' | 'out') => {
    setMessage(null)
    if (!trimmedBanner) {
      setMessage({ type: 'err', text: 'Enter your Banner ID first.' })
      return
    }
    const last = lastActionForBanner(trimmedBanner, punches)
    if (action === 'in' && last === 'in') {
      setMessage({ type: 'err', text: 'You are already clocked in. Clock out before clocking in again.' })
      return
    }
    if (action === 'out' && last !== 'in') {
      setMessage({ type: 'err', text: 'Clock in before you can clock out.' })
      return
    }
    const updated = appendPunch(trimmedBanner, action)
    setPunches(updated)
    setMessage({
      type: 'ok',
      text:
        action === 'in'
          ? `Clocked in at ${formatPunchRow(updated[updated.length - 1].at)}`
          : `Clocked out at ${formatPunchRow(updated[updated.length - 1].at)}`,
    })
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
            {trimmedBanner ? (
              <Badge size="lg" variant="light" color={isClockedIn ? 'teal' : 'gray'}>
                {isClockedIn ? 'Clocked in' : 'Clocked out'}
              </Badge>
            ) : null}
          </Group>
        </Paper>

        {/* Punch Form */}
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
                onClick={() => punch('in')}
                disabled={!trimmedBanner || isClockedIn}
              >
                Clock In
              </Button>
              <Button
                color="red"
                variant="light"
                leftSection={<IconLogout size={18} />}
                onClick={() => punch('out')}
                disabled={!trimmedBanner || !isClockedIn}
              >
                Clock Out
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Today's Punches */}
        <Paper withBorder shadow="xs" p="xl" radius="md">
          <Title order={5} mb="md">Today's Punches</Title>
          {todayPunches.length === 0 ? (
            <Text size="sm" c="dimmed">No punches recorded for today yet.</Text>
          ) : (
            <ScrollArea.Autosize mah={320}>
              <Table striped highlightOnHover withTableBorder verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Banner ID</Table.Th>
                    <Table.Th>Action</Table.Th>
                    <Table.Th>Time</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {todayPunches.map((row) => (
                    <Table.Tr key={row.id}>
                      <Table.Td>{row.bannerId}</Table.Td>
                      <Table.Td>
                        <Badge size="sm" color={row.action === 'in' ? 'teal' : 'orange'} variant="light">
                          {row.action === 'in' ? 'In' : 'Out'}
                        </Badge>
                      </Table.Td>
                      <Table.Td style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatPunchRow(row.at)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea.Autosize>
          )}
        </Paper>

      </Stack>
    </PageLayout>
  )
}