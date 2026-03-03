import { useState, useEffect } from 'react';
import { Container, Grid, Button, Table, Text, Stack } from '@mantine/core';
import { SectionCard } from '../components/SectionCard';
import { mockTimeclockEntries } from '../lib/mockData';

export function Timeclock() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeWorkers = mockTimeclockEntries.filter((e) => e.clockIn && !e.clockOut);

  return (
    <Container size="lg" px="md" py="xl">
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <SectionCard title="Timeclock">
            <Stack gap="lg" align="center" py="xl">
              <Text fw={700} fz="xl">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>

              <Text fw={700} fz="48px" style={{ fontFamily: 'monospace' }}>
                {currentTime}
              </Text>

              <Button
                variant="filled"
                color="brand"
                radius="md"
                size="lg"
                style={{ 
                  minWidth: 200, 
                  backgroundColor: isClockedIn ? '#8B00D4' : '#1A1A1A' 
                }}
                onClick={() => setIsClockedIn(!isClockedIn)}
              >
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </Button>

              <Text fz="sm" c="dimmed">
                Status: {isClockedIn ? 'Currently Clocked In' : 'Not Clocked In'}
              </Text>
            </Stack>
          </SectionCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <SectionCard title="Active Workers">
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
                    Worker
                  </Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '13px' }}>
                    Clock In
                  </Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '13px' }}>
                    Duration
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {activeWorkers.length > 0 ? (
                  activeWorkers.map((worker) => (
                    <Table.Tr key={worker.id}>
                      <Table.Td>{worker.workerName}</Table.Td>
                      <Table.Td>{worker.clockIn}</Table.Td>
                      <Table.Td>--</Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={3} style={{ textAlign: 'center' }}>
                      No workers currently clocked in
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </SectionCard>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
