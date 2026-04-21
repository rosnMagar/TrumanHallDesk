import { useState } from 'react'
import {
  Paper, Title, TextInput, Button, Group, Stack, Text, Card, Image, Center,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import PageLayout from '../Components/PageLayout'
import { useRestApi } from '../hooks/useRestApi'

export default function PictureLookup() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const { data: user, loading, error, execute: fetchUser } = useRestApi<any>({
    url: import.meta.env.VITE_API_URL,
    method: 'GET'
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

  return (
    <PageLayout activeTab="Picture Lookup">
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
              color="brand-purple" 
              onClick={handleSearch} 
              leftSection={<IconSearch size={16} />}
              loading={loading}
            >
              Search
            </Button>
          </Group>
        </Stack>
      </Paper>

      {error && (
        <Card withBorder shadow="sm" radius="md" p="xl" mt="md">
          <Center>
            <Text c="red">Error: {error}</Text>
          </Center>
        </Card>
      )}

      {hasSearched && user && !error && (
        <Card withBorder shadow="sm" radius="md" p="xl" mt="md">
          <Stack align="center" gap="md">
            <Text fw={600} size="lg">Search Results for "{searchQuery}"</Text>
            {/* Use idPicture from the SQL schema */}
            <Image
              src={user.idPicture || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"}
              w={200}
              h={200}
              radius="md"
              alt="Student Picture"
              fallbackSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
            />
            <Stack gap={4} align="center">
              <Text fw={700} size="xl">{user.firstName} {user.lastName}</Text>
              <Text size="sm" c="dimmed">Student ID: {user.bannerID}</Text>
              {user.email && <Text size="sm" c="dimmed">Email: {user.email}</Text>}
              {user.phoneNumber && <Text size="sm" c="dimmed">Phone: {user.phoneNumber}</Text>}
              {user.homeAddress && <Text size="sm" c="dimmed">Address: {user.homeAddress}</Text>}
            </Stack>
          </Stack>
        </Card>
      )}
    </PageLayout>
  )
}
