import { useState } from 'react'
import {
  Group, Button, Text, TextInput, Paper, Title,
  Stack, Grid, Box, Image,
} from '@mantine/core'
import { IconUpload, IconSearch, IconUser, IconPhoto } from '@tabler/icons-react'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import { FileInput } from '@mantine/core'
import { getUser, updateUser, getUserUploadUrl } from '../api/client'
import { useLambda } from '../hooks/useLambda'
import type { User } from '../api/types'

export default function UserInfoUpload() {
  const [activeTab, setActiveTab] = useState<Tab>('Inbound')
  const [searchBannerId, setSearchBannerId] = useState('')
  const [searchStatus, setSearchStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null)

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [displayPicture, setDisplayPicture] = useState<string | null>(null)

  const { execute: fetchUser, loading: isLoading } = useLambda(getUser)
  const { execute: saveUser, loading: isUpdating } = useLambda(updateUser)
  const { execute: fetchUploadUrl } = useLambda(getUserUploadUrl)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [homeAddress, setHomeAddress] = useState('')

  const [file, setFile] = useState<File | null>(null)
  const [updateStatus, setUpdateStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null)

  const handleSearch = async () => {
    if (!searchBannerId.trim()) return
    setSearchStatus(null)
    setUpdateStatus(null)
    setFile(null)
    setDisplayPicture(null)
    try {
      const user = await fetchUser(searchBannerId.trim())
      setCurrentUser(user)
      setDisplayPicture(user.idPicture || null)
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setEmail(user.email || '')
      setPhoneNumber(user.phoneNumber || '')
      setHomeAddress(user.homeAddress || '')
      setSearchStatus({ type: 'success', message: 'User loaded successfully.' })
    } catch (err: any) {
      setCurrentUser(null)
      setSearchStatus({ type: 'error', message: err.message || 'User not found' })
    }
  }

  const handleUpdate = async () => {
    if (!currentUser) return
    setUpdateStatus(null)

    try {
      let finalIdPicture = currentUser.idPicture

      if (file) {
        const ext = file.name.split('.').pop() || 'jpg'
        const { uploadUrl, fileName } = await fetchUploadUrl(currentUser.bannerID, ext, file.type)

        const s3Response = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })

        if (!s3Response.ok) throw new Error('Failed to upload picture to S3')

        finalIdPicture = fileName
        setDisplayPicture(URL.createObjectURL(file))
      }

      await saveUser(currentUser.bannerID, {
        firstName,
        lastName,
        email,
        phoneNumber,
        homeAddress,
        idPicture: finalIdPicture !== currentUser.idPicture ? finalIdPicture : undefined,
      })

      setUpdateStatus({ type: 'success', message: 'User information updated successfully!' })
      setFile(null)

      const updatedUser = await fetchUser(currentUser.bannerID)
      setCurrentUser(updatedUser)
    } catch (err: any) {
      setUpdateStatus({ type: 'error', message: err.message || 'An error occurred during update' })
    }
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab} isAdminPage={true}>
      <Title order={2}>User Information Management</Title>

      <Paper withBorder shadow="xs" p="xl" radius="md">
        <Stack gap="md">
          <Text fw={500}>Search User</Text>
          <Group align="flex-end">
            <TextInput
              label="Banner ID"
              placeholder="Enter Banner ID"
              value={searchBannerId}
              onChange={(e) => setSearchBannerId(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button
              onClick={handleSearch}
              loading={isLoading}
              leftSection={<IconSearch size={16} />}
              color="brand-blue"
            >
              Load User
            </Button>
          </Group>
          {searchStatus && (
            <Text c={searchStatus.type === 'error' ? 'red' : 'teal'} size="sm" fw={500}>
              {searchStatus.message}
            </Text>
          )}
        </Stack>
      </Paper>

      <Paper
        withBorder
        shadow="xs"
        p="xl"
        radius="md"
        style={{ visibility: currentUser ? 'visible' : 'hidden' }}
      >
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <Title order={4}>Edit Details</Title>
              <Group grow>
                <TextInput label="First Name" value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} />
                <TextInput label="Last Name" value={lastName} onChange={(e) => setLastName(e.currentTarget.value)} />
              </Group>
              <TextInput label="Email Address" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
              <TextInput label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.currentTarget.value)} />
              <TextInput label="Home Address" value={homeAddress} onChange={(e) => setHomeAddress(e.currentTarget.value)} />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md" align="center">
              <Title order={4}>Profile Picture</Title>
              <Box
                w={150}
                h={150}
                style={{
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {file ? (
                  <Image src={URL.createObjectURL(file)} w={150} h={150} fit="cover" />
                ) : displayPicture ? (
                  <Image src={displayPicture} w={150} h={150} fit="cover" />
                ) : currentUser?.idPicture ? (
                  <Image src={currentUser.idPicture} w={150} h={150} fit="cover" />
                ) : (
                  <IconUser size={60} color="#bdbdbd" />
                )}
              </Box>
              <FileInput
                placeholder="Upload new picture"
                accept="image/*"
                leftSection={<IconPhoto size={16} />}
                value={file}
                onChange={setFile}
                w="100%"
              />
            </Stack>
          </Grid.Col>
        </Grid>

        <Group mt="xl" justify="flex-end">
          <Button
            color="brand-blue"
            onClick={handleUpdate}
            loading={isUpdating}
            leftSection={<IconUpload size={16} />}
          >
            Save Changes
          </Button>
        </Group>

        {updateStatus && (
          <Text mt="sm" ta="right" c={updateStatus.type === 'error' ? 'red' : 'teal'} fw={600}>
            {updateStatus.message}
          </Text>
        )}
      </Paper>
    </PageLayout>
  )
}