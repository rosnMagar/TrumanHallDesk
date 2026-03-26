import { useState } from 'react'
import {
  Group, Button, TextInput, Paper, Title,
  Table, Pagination
} from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'

interface Package {
  id: number
  building: string
  tracking: string
  description: string
  name: string
  inDate: string
  outDate?: string
  status: 'pickup' | 'forward'
}

export default function ResidenceLifeOutbound() {
  const [activeTab, setActiveTab] = useState<Tab>('Outbound')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(2)

  const [packages, setPackages] = useState<Package[]>([
    {
      id: 456,
      building: 'Ryle',
      tracking: '676767',
      description: 'small box D that has multiple lines of text to test how the table handles long descriptions and whether it wraps or overflows',
      name: 'Bill Gates Testing what happensing with a really long name that should be truncated',
      inDate: '01/02/2014',
      status: 'forward',
    },
    {
      id: 123,
      building: 'BNB',
      tracking: '42069',
      description: 'big box A',
      name: 'Linus Torvalds',
      inDate: '01/02/1999',
      status: 'pickup',
    },
  ])

  const handlePickup = (id: number) => {
    setPackages(p =>
      p.map(pkg =>
        pkg.id === id ? { ...pkg, outDate: new Date().toLocaleDateString() } : pkg
      )
    )
  }

  const handleForward = (id: number) => {
    alert(`Forwarding package ID ${id}`)
  }

  const rows = packages.map(pkg => (
    <Table.Tr key={pkg.id}>
      <Table.Td>{pkg.id}</Table.Td>
      <Table.Td>{pkg.building}</Table.Td>
      <Table.Td>{pkg.tracking}</Table.Td>
      <Table.Td>{pkg.description}</Table.Td>
      <Table.Td>{pkg.name}</Table.Td>
      <Table.Td>{pkg.inDate}</Table.Td>
      <Table.Td>{pkg.outDate || ''}</Table.Td>
      <Table.Td>
        {pkg.status === 'pickup' ? (
          <Button size="xs" color="brand-blue" onClick={() => handlePickup(pkg.id)}>
            Pick Up
          </Button>
        ) : (
          <Button size="xs" variant="light" onClick={() => handleForward(pkg.id)}>
            Forward
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="lg" radius="md">
        <Title order={4} mb="md">
          Package Pickup and Forwarding
        </Title>

        <Group mb="md" justify="space-between">
          <Group>
            <TextInput placeholder="Banner ID" />
            <Button variant="default">To Be Forwarded</Button>
          </Group>
          <Group>
            <Button variant="default">Filter</Button>
            <TextInput
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </Group>
        </Group>

        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Package ID</Table.Th>
              <Table.Th>Building</Table.Th>
              <Table.Th>Tracking #</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>In-date</Table.Th>
              <Table.Th>Out-date</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Group justify="center" mt="md">
          <Pagination value={page} onChange={setPage} total={10} size="sm" />
        </Group>
      </Paper>
    </PageLayout>
  )
}