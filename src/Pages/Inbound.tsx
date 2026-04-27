import { useState } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack,
} from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { useFormFields } from '../hooks/useFormField'

interface MailForm {
  residentName: string
  packageDescription: string
  checkedInBy: string
  infoName: string
  infoBuilding: string
  infoRoom: string
}

export default function ResidenceLife() {
  const [activeTab, setActiveTab] = useState<Tab>('Inbound')
  const [labelNum, setLabelNum] = useState(123456)

  const { form: mail, setForm: setMail, setField: setMailField } = useFormFields<MailForm>({
    residentName: '', packageDescription: '', checkedInBy: '',
    infoName: '', infoBuilding: '', infoRoom: '',
  })

  const handleCheckIn = () => {
    alert(`Label #${labelNum} printed for: ${mail.residentName}`)
    setLabelNum(n => n + 1)
    setMail({ residentName: '', packageDescription: '', checkedInBy: '', infoName: '', infoBuilding: '', infoRoom: '' })
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <Title order={4} mb="lg">Mail Processing</Title>
        <SimpleGrid cols={2} spacing="xl">
          <Stack gap="md">
            <TextInput
              label="Resident Name"
              description="Enter the resident's name as it appears on the shipping label."
              placeholder="Last name, first name"
              value={mail.residentName}
              onChange={setMailField('residentName')}
            />
            <TextInput
              label="Package Description"
              description="Append A, B, or C to the end of the description."
              placeholder="White Amazon Mailer - B"
              value={mail.packageDescription}
              onChange={setMailField('packageDescription')}
            />
            <TextInput
              label="Checked In By"
              description="This should be your name or initials."
              placeholder="John Smith"
              value={mail.checkedInBy}
              onChange={setMailField('checkedInBy')}
            />
          </Stack>
          <Stack gap="md">
            <Paper withBorder shadow="xs" p="md" radius="md" bg="gray.0">
              <Text fw={600} size="sm" mb="sm">Resident Information</Text>
              <Stack gap="xs">
                <TextInput placeholder="Name" value={mail.infoName} onChange={setMailField('infoName')} />
                <TextInput placeholder="Building" value={mail.infoBuilding} onChange={setMailField('infoBuilding')} />
                <TextInput placeholder="Room Number" value={mail.infoRoom} onChange={setMailField('infoRoom')} />
              </Stack>
            </Paper>
            <Group justify="flex-end" align="center">
              <Text size="xs" c="dimmed">Label Number: <strong>{labelNum}</strong></Text>
              <Button color="brand-blue" onClick={handleCheckIn}>Check in and Print Label</Button>
            </Group>
          </Stack>
        </SimpleGrid>
      </Paper>
    </PageLayout>
  )
}