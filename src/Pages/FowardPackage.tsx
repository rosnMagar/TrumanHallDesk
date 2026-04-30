import { useState } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack, Select
} from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { useFormFields } from '../hooks/useFormField'
import { createForwardPackage } from '../api/client'
import { useLambda } from '../hooks/useLambda'

interface ForwardForm {
  owner: string
  building: string
  description: string
  trackingID: string
  reason: string
  instructions: string
  carrier: string
}

export default function ForwardPackage() {
  const [activeTab, setActiveTab] = useState<Tab>('Forward')
  const [fwdNum, setFwdNum] = useState(1234)

  const { form: fwd, setForm: setFwd, setField: setFwdField } = useFormFields<ForwardForm>({
    owner: '', building: '', description: '', trackingID: '', reason: 'Return to Sender', instructions: '', carrier: ''
  })

  const { execute: submitForward, loading: isSubmitting, error: submitError, reset: resetSubmit } = useLambda(createForwardPackage)
  const [successMsg, setSuccessMsg] = useState('')

  const handleForward = async () => {
    resetSubmit()
    setSuccessMsg('')
    try {
      await submitForward({
        owner: fwd.owner,
        building: fwd.building,
        description: fwd.carrier ? `${fwd.carrier} - ${fwd.description}` : fwd.description,
        trackingID: fwd.trackingID,
        reason: fwd.reason,
        instructions: fwd.instructions
      })
      setSuccessMsg(`Forwarding package logged successfully! Label Number: FW${fwdNum}`)
      setFwdNum(n => n + 1)
      setFwd({ owner: '', building: '', description: '', trackingID: '', reason: 'Return to Sender', instructions: '', carrier: '' })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <Title order={4} mb="lg">Forward Package</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Stack gap="md">
            <TextInput
              label="Resident Name"
              description="Enter the resident's name as it appears on the shipping label."
              placeholder="Last name, first name"
              value={fwd.owner}
              onChange={setFwdField('owner')}
              required
            />
            <TextInput
              label="Building"
              placeholder="e.g. MO (for Missouri Hall)"
              value={fwd.building}
              onChange={setFwdField('building')}
            />
            <TextInput
              label="Package Description"
              description="Append A, B, or C to the end of the description."
              placeholder="White Amazon Mailer - B"
              value={fwd.description}
              onChange={setFwdField('description')}
            />
            <TextInput
              label="Tracking Number"
              placeholder="Enter tracking ID if available"
              value={fwd.trackingID}
              onChange={setFwdField('trackingID')}
            />
          </Stack>
          <Stack gap="md">
            <Select
              label="Carrier"
              data={['Amazon', 'DHL', 'FedEx', 'UPS', 'US Postal Service']}
              value={fwd.carrier}
              onChange={(val) => setFwd({ ...fwd, carrier: val || '' })}
              required
            />
            <Select
              label="Reason for Forwarding"
              data={['Delivered to wrong hall', 'Forwarding to updated address', 'Return to Sender']}
              value={fwd.reason}
              onChange={(val) => setFwd({ ...fwd, reason: val || 'Return to Sender' })}
            />
            <TextInput
              label="Instructions"
              description="Any special handling instructions or forwarding address"
              value={fwd.instructions}
              onChange={setFwdField('instructions')}
            />
            
            {submitError && <Text c="red" size="sm" mt="sm">{submitError}</Text>}
            {successMsg && <Text c="teal" size="sm" mt="sm" fw={500}>{successMsg}</Text>}
            
            <Group justify="flex-end" align="center" mt="auto">
              <Text size="xs" c="dimmed">Label Number: <strong>FW{fwdNum}</strong></Text>
              <Button color="brand-blue" loading={isSubmitting} onClick={handleForward} disabled={!fwd.owner.trim()}>Log Forward & Print Label</Button>
            </Group>
          </Stack>
        </SimpleGrid>
      </Paper>
    </PageLayout>
  )
}