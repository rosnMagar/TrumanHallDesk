import { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import {
  AppShell, Group, Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack, Anchor, Box,
} from '@mantine/core'
import { IconDeviceDesktop } from '@tabler/icons-react'

type Tab = 'Inbound' | 'Outbound' | 'Lock-out' | 'Equipment' | 'Timeclock'

const TABS: Tab[] = ['Inbound', 'Outbound', 'Lock-out', 'Equipment', 'Timeclock']

interface MailForm {
  residentName: string
  packageDescription: string
  checkedInBy: string
  infoName: string
  infoBuilding: string
  infoRoom: string
}

interface ForwardForm {
  residentName: string
  packageDescription: string
  processedBy: string
  forwardTo: string
}

export default function ResidenceLife() {
  const navigate = useNavigate() 

  const [activeTab, setActiveTab] = useState<Tab>('Inbound')
  const [labelNum, setLabelNum] = useState(123456)
  const [fwdNum, setFwdNum] = useState(1234)

  const [mail, setMail] = useState<MailForm>({
    residentName: '', packageDescription: '', checkedInBy: '',
    infoName: '', infoBuilding: '', infoRoom: '',
  })

  const [fwd, setFwd] = useState<ForwardForm>({
    residentName: '', packageDescription: '', processedBy: '', forwardTo: '',
  })

  const setMailField = (f: keyof MailForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setMail(p => ({ ...p, [f]: e.target.value }))

  const setFwdField = (f: keyof ForwardForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFwd(p => ({ ...p, [f]: e.target.value }))

  const handleCheckIn = () => {
    alert(`Label #${labelNum} printed for: ${mail.residentName}`)
    setLabelNum(n => n + 1)
    setMail({ residentName: '', packageDescription: '', checkedInBy: '', infoName: '', infoBuilding: '', infoRoom: '' })
  }

  const handleForward = () => {
    alert(`FWD${fwdNum} printed. Forwarding to: ${fwd.forwardTo}`)
    setFwdNum(n => n + 1)
    setFwd({ residentName: '', packageDescription: '', processedBy: '', forwardTo: '' })
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 80 }} padding={0}>

      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text fw={700} size="xl" c="grape">Residence Life</Text>
          <Group gap="xs">
            {TABS.map(tab => (
              <Button
                key={tab}
                size="xs"
                variant={activeTab === tab ? 'filled' : 'default'}
                color="grape"
                onClick={() => {
                  setActiveTab(tab)

                  
                  if (tab === 'Inbound') navigate('/')
                  if (tab === 'Outbound') navigate('/outbound')
                  if (tab === 'Equipment') navigate('/equipment')
                  if (tab === 'Lock-out') navigate('/lockout')
                  if (tab === 'Timeclock') navigate('/timeclock')
                }}
              >
                {tab}
              </Button>
            ))}
          </Group>
          <Group gap="xs">
            <Text size="sm">BNB Desk</Text>
            <Box w={32} h={32} style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-grape-6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconDeviceDesktop size={16} color="white" />
            </Box>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Main */}
      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">

          {/* Mail Processing */}
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
                <Paper withBorder p="md" radius="md" bg="gray.0">
                  <Text fw={600} size="sm" mb="sm">Resident Information</Text>
                  <Stack gap="xs">
                    <TextInput placeholder="Name" value={mail.infoName} onChange={setMailField('infoName')} />
                    <TextInput placeholder="Building" value={mail.infoBuilding} onChange={setMailField('infoBuilding')} />
                    <TextInput placeholder="Room Number" value={mail.infoRoom} onChange={setMailField('infoRoom')} />
                  </Stack>
                </Paper>
                <Group justify="flex-end" align="center">
                  <Text size="xs" c="dimmed">Label Number: <strong>{labelNum}</strong></Text>
                  <Button color="grape" onClick={handleCheckIn}>Check in and Print Label</Button>
                </Group>
              </Stack>
            </SimpleGrid>
          </Paper>

          {/* Forward Package */}
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
                  <Button color="grape" onClick={handleForward}>Mark 'FWD' and Print Label</Button>
                </Group>
              </Stack>
            </SimpleGrid>
          </Paper>

        </Stack>
      </AppShell.Main>

      {/* Footer */}
      <AppShell.Footer bg="gray.2" p="md">
        <SimpleGrid cols={3} maw={900} mx="auto">
          <Stack gap={4}>
            <Text fw={700} size="sm">Contact Info</Text>
            {[['HD On-Duty', '263-456-7890'], ['RA On-Duty', '263-456-7890'], ['CC On-Duty', '263-456-7890']].map(([role, num]) => (
              <Group key={role} gap="lg">
                <Text size="xs" c="dimmed" w={80}>{role}</Text>
                <Anchor href={`tel:${num}`} size="xs">{num}</Anchor>
              </Group>
            ))}
          </Stack>
          <Stack gap={4}>
            <Text fw={700} size="sm">Report an Issue</Text>
            {['Message Comm. Cordinator', 'Building Issue', 'ITS Website'].map(l => (
              <Anchor key={l} href="#" size="xs">{l}</Anchor>
            ))}
          </Stack>
          <Stack gap={4}>
            <Text fw={700} size="sm">Useful Links</Text>
            {['Frequently Asked Questions', 'Desk Worker Schedule', 'Binder PDF'].map(l => (
              <Anchor key={l} href="#" size="xs">{l}</Anchor>
            ))}
          </Stack>
        </SimpleGrid>
      </AppShell.Footer>

    </AppShell>
  )
}