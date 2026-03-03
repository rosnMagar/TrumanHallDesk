import { Container, Grid, TextInput, Button, Table, Badge, Stack } from '@mantine/core';
import { SectionCard } from '../components/SectionCard';
import { mockEquipment } from '../lib/mockData';

export function Equipment() {
  return (
    <Container size="lg" px="md" py="xl">
      <Grid gutter="lg">
        <Grid.Col span={7}>
          <SectionCard title="Equipment Check Out">
            <Stack gap="md">
              <Grid gutter="md">
                <Grid.Col span={4}>
                  <TextInput
                    label="Banner ID"
                    description="Enter resident's Banner ID"
                    placeholder="B00000000"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Resident Name"
                    description="Enter resident's name"
                    placeholder="Last name, first name"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Resident Phone Number"
                    description="Contact number"
                    placeholder="555-0100"
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Equipment Item"
                description="Select the equipment being checked out"
                placeholder="Search equipment..."
              />

              <TextInput
                label="Checked Out By"
                description="Your name or initials"
                placeholder="John Smith"
              />

              <Button variant="filled" color="brand" radius="md" fullWidth>
                Check Out Equipment
              </Button>
            </Stack>
          </SectionCard>
        </Grid.Col>

        <Grid.Col span={5}>
          <SectionCard title="Equipment Inventory">
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
                  <Table.Th style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '13px' }}>
                    Item
                  </Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '13px' }}>
                    Available
                  </Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '13px' }}>
                    Status
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockEquipment.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.available} / {item.total}</Table.Td>
                    <Table.Td>
                      {item.available > 0 ? (
                        <Badge color="green" variant="light">Available</Badge>
                      ) : (
                        <Badge color="red" variant="light">Out</Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </SectionCard>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
