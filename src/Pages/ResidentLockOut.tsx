import { useState } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack, List,
} from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { useFormFields } from '../hooks/useFormField'

interface LockoutForm {
  bannerId: string
  phoneNumber: string
  keyNumber: string
}

export default function ResidentLockout() {
  const [activeTab, setActiveTab] = useState<Tab>('Lock-out')
  const { form, setForm, setField } = useFormFields<LockoutForm>({
    bannerId: '',
    phoneNumber: '',
    keyNumber: '',
  })

  const handleSubmit = () => {
    alert(`Lockout submitted!\nBanner ID: ${form.bannerId}\nPhone: ${form.phoneNumber}\nKey: ${form.keyNumber}`)
    setForm({ bannerId: '', phoneNumber: '', keyNumber: '' })
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <Title order={4} mb="lg">Resident Lockout</Title>
        <SimpleGrid cols={2} spacing="xl">
          <Stack gap="md">
            <TextInput
              label="Banner ID"
              description="Swipe the resident's badge or type their ID number"
              placeholder="Banner ID"
              value={form.bannerId}
              onChange={setField('bannerId')}
            />
            <TextInput
              label="Phone Number"
              description="This will be autofilled after swiping badge"
              placeholder="Resident Phone Number"
              value={form.phoneNumber}
              onChange={setField('phoneNumber')}
            />
            <TextInput
              label="Key Number"
              description="Enter the code engraved on the key"
              placeholder="304"
              value={form.keyNumber}
              onChange={setField('keyNumber')}
            />
          </Stack>
          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Text fw={600} size="sm" mb="sm">Desk Attendant Instructions</Text>
            <List size="sm" c="dimmed" spacing={4}>
              <List.Item>Please inform the resident they will be charged $10</List.Item>
              <List.Item>Swipe the resident's card</List.Item>
              <List.Item>Unlock the key box in the closet</List.Item>
              <List.Item>Get the key and enter the code in the Key Number box</List.Item>
            </List>
          </Paper>
        </SimpleGrid>
      </Paper>
      <Group justify="center">
        <Button color="brand-blue" px="xl" onClick={handleSubmit}>
          Submit Lockout
        </Button>
      </Group>
    </PageLayout>
  )
}