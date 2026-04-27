//Looks good for now frontend wise
import { useState } from 'react'
import {
  Paper, Title, TextInput, Button, Group, Stack, Text, Card, Image, Center,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { useRestApi } from '../hooks/useRestApi'

export default function PictureLookup() {
  const [activeTab, setActiveTab] = useState<Tab>('Picture Lookup')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const { data: user, loading, error, execute: fetchUser } = useRestApi<any>({
    url: import.meta.env.VITE_API_URL,
    method: 'GET',
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    try {
      await fetchUser(undefined, undefined, `/users/${searchQuery.trim()}`)
      setHasSearched(true)
    } catch (err) {
      console.error(err)
    }
  }

  const showResults = hasSearched && user && !error
  const showError = !!error

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <Title order={4} mb="lg">Picture Lookup</Title>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Search for a student's picture using their Name or Student ID.
          </Text>
          <Group align="flex-end">
            <TextInput
              label="Student Name or ID"
              placeholder="e.g. John Doe or 12345678"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              color="brand-blue"
              onClick={handleSearch}
              leftSection={<IconSearch size={16} />}
              loading={loading}
            >
              Search
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Card
        withBorder
        shadow="xs"
        radius="md"
        p="xl"
        style={{ visibility: showError ? 'visible' : 'hidden' }}
      >
        <Center>
          <Text c="red">Error: {error}</Text>
        </Center>
      </Card>

      <Card
        withBorder
        shadow="xs"
        radius="md"
        p="xl"
        style={{ visibility: showResults ? 'visible' : 'hidden' }}
      >
        <Stack align="center" gap="md">
          <Text fw={600} size="lg">
            {showResults ? `Search Results for "${searchQuery}"` : '\u00a0'}
          </Text>
          <Image
            src={user?.idPicture || 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'}
            w={200}
            h={200}
            radius="md"
            alt="Student Picture"
            fallbackSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
          />
          <Stack gap={4} align="center">
            <Text fw={700} size="xl">{user?.firstName} {user?.lastName}</Text>
            <Text size="sm" c="dimmed">Student ID: {user?.bannerID}</Text>
            <Text size="sm" c="dimmed">{user?.email ? `Email: ${user.email}` : '\u00a0'}</Text>
            <Text size="sm" c="dimmed">{user?.phoneNumber ? `Phone: ${user.phoneNumber}` : '\u00a0'}</Text>
            <Text size="sm" c="dimmed">{user?.homeAddress ? `Address: ${user.homeAddress}` : '\u00a0'}</Text>
          </Stack>
        </Stack>
      </Card>
    </PageLayout>
  )
}