import { useState } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  Stack, Select
} from '@mantine/core'
import { IconUserPlus, IconId } from '@tabler/icons-react'
import { provisionWorker } from '../api/client'
import { useLambda } from '../hooks/useLambda'
import PageLayout from '../Components/PageLayout'

export default function ProvisionWorker() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [assignedBuilding, setAssignedBuilding] = useState<string | null>(null)
  const [generatedBannerId, setGeneratedBannerId] = useState<string>('')

  const { execute: submitProvision, loading: isSubmitting, error: submitError, reset } = useLambda(provisionWorker)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    reset()
    setGeneratedBannerId('')

    try {
      const response = await submitProvision({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        assignedBuilding: assignedBuilding || undefined
      })
      
      setGeneratedBannerId(response.bannerID)
      setFirstName('')
      setLastName('')
      setEmail('')
      setAssignedBuilding(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <PageLayout activeTab={'Inbound'} isAdminPage={true} adminLabel="Provisioning">
      <Paper withBorder shadow="xs" p="xl" radius="md" maw={600} mx="auto">
        <Title order={3} mb="sm">Provision New Desk Worker</Title>
        <Text c="dimmed" size="sm" mb="xl">
          Create a new Cognito account for a desk worker. The system will automatically generate a 9-digit Banner ID and link the accounts.
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
                required
              />
            </Group>

            <TextInput
              label="Email Address"
              description="Temporary password will be sent here."
              placeholder="john.doe@truman.edu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />

            <Select
              label="Assigned Building"
              description="Optional. Select primary building assignment."
              placeholder="Pick building"
              data={[
                { value: 'BNB', label: 'Blanton-Nason-Brewer' },
                { value: 'MH', label: 'Missouri Hall' },
                { value: 'DH', label: 'Dobson Hall' },
                { value: 'RH', label: 'Ryle Hall' },
                { value: 'CH', label: 'Centennial Hall' },
                { value: 'CA', label: 'Campbell Apartments' },
                { value: 'WCS', label: 'West Campus Suites' }
              ]}
              value={assignedBuilding}
              onChange={setAssignedBuilding}
              clearable
            />

            {submitError && (
              <Text c="red" size="sm" mt="sm">{submitError}</Text>
            )}

            {generatedBannerId && (
              <Paper withBorder p="md" bg="teal.0" mt="md">
                <Group align="center" justify="space-between">
                  <div>
                    <Text fw={600} c="teal.9">Worker Provisioned Successfully!</Text>
                    <Text size="sm" c="teal.8">Temporary password sent to user's email.</Text>
                  </div>
                  <Group gap={8}>
                    <IconId color="var(--mantine-color-teal-8)" size={24} />
                    <Text fw={700} size="xl" c="teal.9" style={{ letterSpacing: '2px' }}>
                      {generatedBannerId}
                    </Text>
                  </Group>
                </Group>
              </Paper>
            )}

            <Button 
              type="submit"
              color="brand-blue"
              mt="md"
              loading={isSubmitting}
              leftSection={<IconUserPlus size={18} />}
            >
              Provision Worker
            </Button>
          </Stack>
        </form>
      </Paper>
    </PageLayout>
  )
}
