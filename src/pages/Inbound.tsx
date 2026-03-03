import { useState } from 'react';
import { Container, Grid, TextInput, Button, Group, Select } from '@mantine/core';
import { SectionCard } from '../components/SectionCard';
import { ResidentInfoPanel } from '../components/InfoPanel';
import { mockResidents } from '../lib/mockData';

export function Inbound() {
  const [residentName, setResidentName] = useState('');
  const [residentInfo, setResidentInfo] = useState<{ name?: string; building?: string; room?: string }>({});

  const handleResidentLookup = () => {
    const resident = mockResidents[residentName];
    if (resident) {
      setResidentInfo({
        name: resident.name,
        building: resident.building,
        room: resident.room,
      });
    } else {
      setResidentInfo({});
    }
  };

  return (
    <Container size="lg" px="md" py="xl">
      <Grid gutter="lg">
        <Grid.Col span={7}>
          <SectionCard title="Mail Processing">
            <Grid gutter="md">
              <Grid.Col span={12}>
                <TextInput
                  label="Resident Name"
                  description="Enter the resident's name as it appears on the shipping label."
                  placeholder="Last name, first name"
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  onBlur={handleResidentLookup}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Package Description"
                  description="Append A, B, or C to the end of the description."
                  placeholder="White Amazon Mailer - B"
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Checked In By"
                  description="This should be your name or initials."
                  placeholder="John Smith"
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Button variant="filled" color="brand" radius="md" fullWidth>
                  Check In and Print Label
                </Button>
              </Grid.Col>
            </Grid>
          </SectionCard>

          <SectionCard title="Forward Package">
            <Grid gutter="md">
              <Grid.Col span={12}>
                <TextInput
                  label="Resident Name"
                  placeholder="Last name, first name"
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Tracking Number"
                  placeholder="1Z999AA10123456784"
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  label="Forwarding Address Type"
                  placeholder="Select type"
                  data={['Permanent', 'Temporary']}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Group justify="flex-end">
                  <Button
                    variant="default"
                    radius="md"
                    style={{
                      border: '1px solid #C0C0C0',
                      color: '#333333',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    Forward
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </SectionCard>
        </Grid.Col>

        <Grid.Col span={5}>
          <ResidentInfoPanel
            name={residentInfo.name}
            building={residentInfo.building}
            room={residentInfo.room}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
