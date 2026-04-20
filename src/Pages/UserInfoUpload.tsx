import { useState } from 'react'
import {
  AppShell, Group, Button, Paper, Title, Stack, Text, FileInput, Center, Table
} from '@mantine/core'
import { IconUpload, IconFileSpreadsheet } from '@tabler/icons-react'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'

export default function UserInfoUpload() {
  const [activeTab, setActiveTab] = useState<Tab>('Inbound')
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle')

  const handleUpload = () => {
    if (!file) return
    setUploadStatus('uploading')
    // Simulate upload delay
    setTimeout(() => {
      setUploadStatus('success')
      setFile(null)
    }, 1500)
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} isAdminPage={true} />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">
          <Title order={2}>User Information Upload</Title>

          <Paper withBorder shadow="xs" p="xl" radius="md">
            <Stack gap="md">
              <Text>
                Upload a CSV or Excel file containing user information to update the system database. 
                Ensure your file includes columns for Student ID, Name, Building, and Room Number.
              </Text>
              
              <Paper withBorder p="xl" radius="md" bg="gray.0">
                <Stack align="center" gap="md">
                  <FileInput
                    label="Select data file"
                    placeholder="Click to browse"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    leftSection={<IconFileSpreadsheet size={20} />}
                    value={file}
                    onChange={setFile}
                    w="100%"
                    maw={400}
                  />
                  
                  <Button 
                    color="brand-purple" 
                    leftSection={<IconUpload size={16} />}
                    onClick={handleUpload}
                    loading={uploadStatus === 'uploading'}
                    disabled={!file}
                  >
                    Upload and Process
                  </Button>

                  {uploadStatus === 'success' && (
                    <Text c="teal" fw={600}>
                      File uploaded and processed successfully!
                    </Text>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Paper>

          {/* Example Data Format Table */}
          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="md">Required Data Format</Title>
            <Table withColumnBorders withTableBorder highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Student ID</Table.Th>
                  <Table.Th>First Name</Table.Th>
                  <Table.Th>Last Name</Table.Th>
                  <Table.Th>Building</Table.Th>
                  <Table.Th>Room</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>12345678</Table.Td>
                  <Table.Td>John</Table.Td>
                  <Table.Td>Doe</Table.Td>
                  <Table.Td>Truman</Table.Td>
                  <Table.Td>101</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>87654321</Table.Td>
                  <Table.Td>Jane</Table.Td>
                  <Table.Td>Smith</Table.Td>
                  <Table.Td>Miller</Table.Td>
                  <Table.Td>205</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
            <Text size="xs" c="dimmed" mt="sm">
              Note: Headers must match exactly or the upload will fail.
            </Text>
          </Paper>

        </Stack>
      </AppShell.Main>

      <SiteFooter />
    </AppShell>
  )
}
