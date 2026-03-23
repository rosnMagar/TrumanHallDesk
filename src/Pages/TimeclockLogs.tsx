import { useState } from 'react'
import {
  AppShell, Group, Button, Text, TextInput, Paper, Title,
  Stack, Table,
} from '@mantine/core'
import { IconSearch, IconAdjustments } from '@tabler/icons-react'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'

interface TimeclockLog {
  id: number
  building: string
  firstName: string
  lastName: string
  bannerId: string
  inOut: string
  timestamp: string
  ipAddress: string
  computerName: string
}

const INITIAL_LOGS: TimeclockLog[] = [
  { id: 1, building: 'Truman', firstName: 'John', lastName: 'Smith', bannerId: '123456789', inOut: 'In', timestamp: '01/15/2024 08:00 AM', ipAddress: '192.168.1.101', computerName: 'TRUMAN-DSK-01' },
  { id: 2, building: 'Miller', firstName: 'Jane', lastName: 'Doe', bannerId: '987654321', inOut: 'Out', timestamp: '01/15/2024 05:00 PM', ipAddress: '192.168.1.102', computerName: 'MILLER-DSK-02' },
  { id: 3, building: 'Cross', firstName: 'Bob', lastName: 'Johnson', bannerId: '456789123', inOut: 'In', timestamp: '01/16/2024 09:15 AM', ipAddress: '192.168.1.103', computerName: 'CROSS-DSK-01' },
  { id: 4, building: 'Blanton', firstName: 'Alice', lastName: 'Williams', bannerId: '789123456', inOut: 'In', timestamp: '01/16/2024 08:30 AM', ipAddress: '192.168.1.104', computerName: 'BLANTON-DSK-01' },
]

export default function TimeclockLogs() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [logs] = useState<TimeclockLog[]>(INITIAL_LOGS)
  const [search, setSearch] = useState('')

  const filteredLogs = logs.filter(log =>
    !search ||
    log.building.toLowerCase().includes(search.toLowerCase()) ||
    log.firstName.toLowerCase().includes(search.toLowerCase()) ||
    log.lastName.toLowerCase().includes(search.toLowerCase()) ||
    log.bannerId.includes(search)
  )

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Timeclock" />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={1200} mx="auto" gap="lg">
          <Group justify="space-between">
            <Title order={2}>Timeclock</Title>
            <Group gap="sm">
              <Button variant="default" size="sm" leftSection={<IconAdjustments size={14} />}>
                Filter
              </Button>
              <TextInput
                placeholder="Search"
                leftSection={<IconSearch size={14} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                w={180}
              />
            </Group>
          </Group>

          <Text size="sm" c="dimmed">{filteredLogs.length} records</Text>

          <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
            <Table withColumnBorders highlightOnHover verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fw={700}>ID</Table.Th>
                  <Table.Th fw={700}>Building</Table.Th>
                  <Table.Th fw={700}>First Name</Table.Th>
                  <Table.Th fw={700}>Last Name</Table.Th>
                  <Table.Th fw={700}>Banner ID</Table.Th>
                  <Table.Th fw={700}>In/Out</Table.Th>
                  <Table.Th fw={700}>Timestamp</Table.Th>
                  <Table.Th fw={700}>IP Address</Table.Th>
                  <Table.Th fw={700}>Computer Name</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredLogs.map(log => (
                  <Table.Tr key={log.id}>
                    <Table.Td>{log.id}</Table.Td>
                    <Table.Td>{log.building}</Table.Td>
                    <Table.Td>{log.firstName}</Table.Td>
                    <Table.Td>{log.lastName}</Table.Td>
                    <Table.Td>{log.bannerId}</Table.Td>
                    <Table.Td>{log.inOut}</Table.Td>
                    <Table.Td>{log.timestamp}</Table.Td>
                    <Table.Td>{log.ipAddress}</Table.Td>
                    <Table.Td>{log.computerName}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Stack>
      </AppShell.Main>

      <SiteFooter />
    </AppShell>
  )
}
