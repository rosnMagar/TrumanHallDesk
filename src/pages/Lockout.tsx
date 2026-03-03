import { Container, Grid, TextInput, Button, Select, Textarea, Stack } from '@mantine/core';
import { SectionCard } from '../components/SectionCard';
import { InfoPanel } from '../components/InfoPanel';

export function Lockout() {
  return (
    <Container size="lg" px="md" py="xl">
      <Grid gutter="lg">
        <Grid.Col span={6}>
          <SectionCard title="Lock-out Request">
            <Stack gap="md">
              <TextInput
                label="Resident Name"
                description="Enter the resident's name as it appears in the system."
                placeholder="Last name, first name"
              />
              <TextInput
                label="Room Number"
                description="Building and room number (e.g., Truman 204A)"
                placeholder="Truman 204A"
              />
              <Select
                label="Building"
                placeholder="Select building"
                data={['Truman', 'Kennedy', 'Winfield', 'Lincoln', 'Roosevelt']}
              />
              <Select
                label="Reason for Lock-out"
                placeholder="Select reason"
                data={['Lost Key', 'Locked Out', 'Malfunctioning Lock', 'Other']}
              />
              <Textarea
                label="Additional Notes"
                description="Any additional information about the lock-out situation."
                placeholder="Enter any relevant details..."
                minRows={3}
              />
              <TextInput
                label="Checked In By"
                description="Your name or initials."
                placeholder="John Smith"
              />
              <Button variant="filled" color="brand" radius="md" fullWidth>
                Submit Lock-out Request
              </Button>
            </Stack>
          </SectionCard>
        </Grid.Col>

        <Grid.Col span={6}>
          <InfoPanel title="Desk Attendant Instructions">
            <Stack gap="sm">
              <TextInput
                label="Resident Banner ID"
                placeholder="Enter Banner ID"
              />
              <Button variant="filled" color="brand" radius="md" fullWidth>
                Verify Resident
              </Button>
              <Textarea
                label="Admin Notes"
                placeholder="Internal notes about this lock-out request..."
                minRows={4}
              />
              <Button
                variant="default"
                radius="md"
                fullWidth
                style={{
                  border: '1px solid #C0C0C0',
                  color: '#333333',
                  backgroundColor: '#FFFFFF',
                }}
              >
                Mark as Complete
              </Button>
            </Stack>
          </InfoPanel>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
