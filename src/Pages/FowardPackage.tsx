import { useState } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack,
} from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { useFormFields } from '../hooks/useFormField'

interface ForwardForm {
  residentName: string
  packageDescription: string
  processedBy: string
  forwardTo: string
}

export default function ForwardPackage() {
  const [activeTab, setActiveTab] = useState<Tab>('Forward')
  const [fwdNum, setFwdNum] = useState(1234)

  const { form: fwd, setForm: setFwd, setField: setFwdField } = useFormFields<ForwardForm>({
    residentName: '', packageDescription: '', processedBy: '', forwardTo: '',
  })

  const handleForward = () => {
    alert(`FWD${fwdNum} printed. Forwarding to: ${fwd.forwardTo}`)
    setFwdNum(n => n + 1)
    setFwd({ residentName: '', packageDescription: '', processedBy: '', forwardTo: '' })
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <Title order={4} mb="lg">Forward Package</Title>
        <SimpleGrid cols={2} spacing="xl">
          <Stack gap="md">
            <TextInput
              label="Resident Name"
              description="Enter the resident's name as it appears on the shipping label."
              placeholder="Last name, first name"
              value={fwd.residentName}
              onChange={setFwdField('residentName')}
            />
            <TextInput
              label="Package Description"
              description="Append A, B, or C to the end of the description."
              placeholder="White Amazon Mailer - B"
              value={fwd.packageDescription}
              onChange={setFwdField('packageDescription')}
            />
            <TextInput
              label="Processed By"
              description="This should be your name or initials."
              placeholder="John Smith"
              value={fwd.processedBy}
              onChange={setFwdField('processedBy')}
            />
          </Stack>
          <Stack gap="md">
            <TextInput
              label="Forward To"
              description="This package should be sent to the following location:"
              placeholder="Shipping Address"
              value={fwd.forwardTo}
              onChange={setFwdField('forwardTo')}
            />
            <Group justify="flex-end" align="center" mt="auto">
              <Text size="xs" c="dimmed">Label Number: <strong>FW{fwdNum}</strong></Text>
              <Button color="brand-blue" onClick={handleForward}>Mark 'FWD' and Print Label</Button>
            </Group>
          </Stack>
        </SimpleGrid>
      </Paper>
    </PageLayout>
  )
}