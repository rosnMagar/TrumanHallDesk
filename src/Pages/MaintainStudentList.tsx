import { useState } from 'react'
import {
  AppShell, Group, Button, TextInput, Paper, Title,
  SimpleGrid, Stack, Divider, Checkbox,
} from '@mantine/core'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'

export default function MaintainStudentList() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')

  const [searchBannerId, setSearchBannerId] = useState('')

  const [newBannerId, setNewBannerId] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newBuildingRoom, setNewBuildingRoom] = useState('')
  const [specialUseCard, setSpecialUseCard] = useState(false)
  const [offcampusAddr1, setOffcampusAddr1] = useState('')
  const [offcampusAddr2, setOffcampusAddr2] = useState('')
  const [cityStateZip, setCityStateZip] = useState('')

  const handleSearch = () => {
    alert(`Search for student: ${searchBannerId}`)
  }

  const handleAdd = () => {
    if (!newBannerId || !newName) return
    alert(`Add student: ${newBannerId} - ${newName}`)
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Maintain Student List" isAdminPage={true} />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">
          <Title order={2}>Maintain Student List</Title>

          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="md">Change or Remove Student</Title>
            <Group gap="md">
              <TextInput
                label="Banner ID"
                placeholder="Enter Banner ID"
                value={searchBannerId}
                onChange={(e) => setSearchBannerId(e.target.value)}
                style={{ flex: 1 }}
              />
              <Group align="flex-end">
                <Button color="grape" onClick={handleSearch}>
                  Submit
                </Button>
              </Group>
            </Group>
          </Paper>

          <Divider my="md" />

          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="md">Add a New Student</Title>
            <Stack gap="md">
              <SimpleGrid cols={6} spacing="md">
                <TextInput
                  label="Banner ID"
                  placeholder="Banner ID"
                  value={newBannerId}
                  onChange={(e) => setNewBannerId(e.target.value)}
                />
                <TextInput
                  label="Name"
                  placeholder="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <TextInput
                  label="Phone"
                  placeholder="Phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <TextInput
                  label="Email"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <TextInput
                  label="Code"
                  placeholder="Code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                />
                <TextInput
                  label="Building/Room"
                  placeholder="Building/Room"
                  value={newBuildingRoom}
                  onChange={(e) => setNewBuildingRoom(e.target.value)}
                />
              </SimpleGrid>

              <Checkbox
                label="Special Use Card"
                checked={specialUseCard}
                onChange={(e) => setSpecialUseCard(e.currentTarget.checked)}
              />

              <SimpleGrid cols={3} spacing="md">
                <TextInput
                  label="Offcampus Address 1"
                  placeholder="Address 1"
                  value={offcampusAddr1}
                  onChange={(e) => setOffcampusAddr1(e.target.value)}
                />
                <TextInput
                  label="Offcampus Address 2"
                  placeholder="Address 2"
                  value={offcampusAddr2}
                  onChange={(e) => setOffcampusAddr2(e.target.value)}
                />
                <TextInput
                  label="City/State/Zip"
                  placeholder="City, State ZIP"
                  value={cityStateZip}
                  onChange={(e) => setCityStateZip(e.target.value)}
                />
              </SimpleGrid>

              <Group justify="flex-end">
                <Button color="grape" onClick={handleAdd}>
                  Add
                </Button>
              </Group>
            </Stack>
          </Paper>

          <Group gap="lg">
            <Button variant="link" color="grape">View Student List by Hall</Button>
            <Button variant="link" color="grape">Export Off-Campus Addresses</Button>
          </Group>
        </Stack>
      </AppShell.Main>

      <SiteFooter />
    </AppShell>
  )
}
