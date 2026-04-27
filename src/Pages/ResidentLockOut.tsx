import { useState, useEffect } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  SimpleGrid, Stack, List, Image, Center, Box
} from '@mantine/core'
import { IconSearch, IconKey, IconUser } from '@tabler/icons-react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { getUser, createLockout } from '../api/client'
import { useLambda } from '../hooks/useLambda'
import type { User } from '../api/types'

export default function ResidentLockout() {
  const [activeTab, setActiveTab] = useState<Tab>('Lock-out')

  const [searchBannerId, setSearchBannerId] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [deskAttendantId, setDeskAttendantId] = useState<string>('')

  const [phoneNumber, setPhoneNumber] = useState('')
  const [keyNumber, setKeyNumber] = useState('')

  const { execute: fetchUser, loading: isLoadingUser, error: searchError, reset: resetUser } = useLambda(getUser)
  const { execute: submitLockout, loading: isSubmitting, error: submitError, reset: resetSubmit } = useLambda(createLockout)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    fetchAuthSession().then(session => {
      const username = session.tokens?.accessToken?.payload?.username as string
      if (username) {
        setDeskAttendantId(username)
      }
    }).catch(err => console.error('Error fetching session', err))
  }, [])

  const handleSearch = async () => {
    if (!searchBannerId.trim()) return
    setSuccessMsg('')
    resetSubmit()
    try {
      const user = await fetchUser(searchBannerId.trim())
      setCurrentUser(user)
      setPhoneNumber(user.phoneNumber || '')
      setKeyNumber('')
    } catch (err) {
      setCurrentUser(null)
    }
  }

  const handleSubmit = async () => {
    if (!currentUser || !keyNumber.trim()) return

    setSuccessMsg('')
    try {
      await submitLockout({
        ownerBannerID: currentUser.bannerID,
        checkoutBannerID: deskAttendantId,
        keyNumber: keyNumber.trim(),
        phoneNumber: phoneNumber.trim() || undefined
      })
      setSuccessMsg('Lockout equipment entry created successfully!')
      setCurrentUser(null)
      setSearchBannerId('')
      setPhoneNumber('')
      setKeyNumber('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="xl" radius="md">
        <Title order={4} mb="lg">Resident Lockout</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Stack gap="md">

            <Paper withBorder p="md" radius="md">
              <Text fw={500} mb="sm">Find Resident</Text>
              <Group align="flex-end">
                <TextInput
                  label="Banner ID"
                  description="Swipe badge or type ID"
                  placeholder="Enter Banner ID"
                  value={searchBannerId}
                  onChange={(e) => setSearchBannerId(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Button
                  onClick={handleSearch}
                  loading={isLoadingUser}
                  leftSection={<IconSearch size={16} />}
                  color="brand-purple"
                >
                  Lookup
                </Button>
              </Group>
              {searchError && (
                <Text c="red" size="sm" mt="sm">{searchError}</Text>
              )}
            </Paper>

            {currentUser && (
              <Paper withBorder p="md" radius="md" bg="gray.0">
                <Group align="flex-start" wrap="nowrap">
                  <Box w={100} h={100} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
                    {currentUser.idPicture ? (
                      <Image src={currentUser.idPicture} w={100} h={100} fit="cover" />
                    ) : (
                      <Center h="100%" bg="gray.2">
                        <IconUser size={40} color="gray" />
                      </Center>
                    )}
                  </Box>
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text fw={600} size="lg">{currentUser.firstName} {currentUser.lastName}</Text>
                    <Text size="sm" c="dimmed">{currentUser.email}</Text>
                    <Text size="sm" c="dimmed">{currentUser.homeAddress}</Text>
                  </Stack>
                </Group>

                <Stack mt="md" gap="md">
                  <TextInput
                    label="Phone Number"
                    description="Confirm or update the resident's phone number"
                    placeholder="e.g. 555-1234"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                  />
                  <TextInput
                    label="Key Number"
                    description="Enter the code engraved on the key"
                    placeholder="e.g. 304"
                    value={keyNumber}
                    onChange={(e) => setKeyNumber(e.currentTarget.value)}
                    required
                  />
                </Stack>

                {submitError && <Text c="red" size="sm" mt="sm">{submitError}</Text>}
                {successMsg && <Text c="teal" size="sm" mt="sm" fw={500}>{successMsg}</Text>}

                <Group justify="flex-end" mt="xl">
                  <Button
                    color="brand-blue"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!keyNumber.trim()}
                    leftSection={<IconKey size={16} />}
                  >
                    Submit Lockout
                  </Button>
                </Group>
              </Paper>
            )}

          </Stack>

          <Paper withBorder p="md" radius="md" bg="gray.0" h="fit-content">
            <Text fw={600} size="sm" mb="sm">Desk Attendant Instructions</Text>
            <List size="sm" c="dimmed" spacing={8}>
              <List.Item>Ask the resident for their Banner ID or swipe their card.</List.Item>
              <List.Item>Verify their identity using the picture displayed.</List.Item>
              <List.Item>Please inform the resident they will be charged a lockout fee.</List.Item>
              <List.Item>Unlock the key box in the closet and retrieve the spare key.</List.Item>
              <List.Item>Enter the key number in the form and click Submit.</List.Item>
            </List>
          </Paper>
        </SimpleGrid>
      </Paper>
    </PageLayout>
  )
}