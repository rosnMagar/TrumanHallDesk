import { useState } from 'react';
import { Container, Table, Button, Group, Pagination, Select, TextInput, Grid } from '@mantine/core';
import { SectionCard } from '../components/SectionCard';
import { mockPackages } from '../lib/mockData';
import type { Package } from '../lib/mockData';

export function Outbound() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string | null>('all');
  const [search, setSearch] = useState('');

  const filteredPackages = mockPackages.filter((pkg) => {
    const matchesFilter = filter === 'all' || filter === null || 
      (filter === 'pickup' && pkg.type === 'pickup') ||
      (filter === 'forward' && pkg.type === 'forward');
    const matchesSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.tracking.includes(search);
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPackages.length / 10);

  return (
    <Container size="lg" px="md" py="xl">
      <SectionCard title="Outbound Packages">
        <Grid gutter="md" mb="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Search by name or tracking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              placeholder="Filter by type"
              value={filter}
              onChange={setFilter}
              data={[
                { value: 'all', label: 'All Types' },
                { value: 'pickup', label: 'Pick Up' },
                { value: 'forward', label: 'Forward' },
              ]}
              clearable
            />
          </Grid.Col>
        </Grid>

        <Table
          withColumnBorders
          withRowBorders
          highlightOnHover
          verticalSpacing="xs"
          horizontalSpacing="sm"
          fz="sm"
          style={{ borderColor: '#E0E0E0' }}
        >
          <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
            <Table.Tr>
              {['Package ID', 'Building', 'Tracking #', 'Description', 'Name', 'In-date', 'Out-date', 'Action'].map((col) => (
                <Table.Th
                  key={col}
                  style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '13px' }}
                >
                  {col}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPackages.map((row: Package) => (
              <Table.Tr key={row.packageId}>
                <Table.Td>{row.packageId}</Table.Td>
                <Table.Td>{row.building}</Table.Td>
                <Table.Td>{row.tracking}</Table.Td>
                <Table.Td>{row.description}</Table.Td>
                <Table.Td>{row.name}</Table.Td>
                <Table.Td>{row.inDate}</Table.Td>
                <Table.Td>{row.outDate ?? ''}</Table.Td>
                <Table.Td>
                  {row.outDate ? (
                    <Button size="xs" variant="filled" color="brand" radius="md" disabled>
                      Completed
                    </Button>
                  ) : row.type === 'pickup' ? (
                    <Button size="xs" variant="filled" color="brand" radius="md">
                      Pick Up
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      variant="default"
                      radius="md"
                      style={{ border: '1px solid #C0C0C0' }}
                    >
                      Forward
                    </Button>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="md">
          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            siblings={1}
            boundaries={1}
            color="brand"
            radius="sm"
            size="sm"
          />
        </Group>
      </SectionCard>
    </Container>
  );
}
