import { useState } from 'react'
import { Group, Button, Text, Box, Modal, Stack, UnstyledButton, Menu } from '@mantine/core'
import { AppShell } from '@mantine/core'
import { IconDeviceDesktop, IconSettings, IconLogout } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { useAdmin } from '../context/AdminContext'

export type Tab = 'Inbound' | 'Outbound' | 'Forward' | 'Lock-out' | 'Equipment' | 'Timeclock' | 'Picture Lookup'
export const TABS: Tab[] = ['Inbound', 'Outbound', 'Forward', 'Lock-out', 'Equipment', 'Timeclock', 'Picture Lookup']

export type AdminPage = 'allowed-users' | 'datastream-users' | 'maintain-student' | 'activity-cards' | 'activity-items' | 'timeclock-admin' | 'user-info-upload' | 'provision-worker'

interface SiteHeaderProps {
  activeTab: Tab
  onTabChange?: (tab: Tab) => void
  isAdminPage?: boolean
  adminLabel?: string
}

export default function SiteHeader({ activeTab, onTabChange, isAdminPage = false, adminLabel = 'BNB Desk' }: SiteHeaderProps) {
  const navigate = useNavigate()
  const { signOut } = useAuthenticator()
  const { isAdmin } = useAdmin()
  const [adminModalOpen, setAdminModalOpen] = useState(false)

  const handleTabClick = (tab: Tab) => {
    onTabChange?.(tab)
    if (tab === 'Inbound') navigate('/')
    if (tab === 'Outbound') navigate('/outbound')
    if (tab === 'Forward') navigate('/forward-package')
    if (tab === 'Equipment') navigate('/equipment')
    if (tab === 'Lock-out') navigate('/lockout')
    if (tab === 'Timeclock') navigate('/timeclock')
    if (tab === 'Picture Lookup') navigate('/picture-lookup')
  }

  const handleAdminPageClick = (page: AdminPage) => {
    setAdminModalOpen(false)
    if (page === 'allowed-users') navigate('/admin/allowed-users')
    if (page === 'datastream-users') navigate('/admin/datastream-users')
    if (page === 'maintain-student') navigate('/admin/maintain-student')
    if (page === 'activity-cards') navigate('/admin/activity-cards')
    if (page === 'activity-items') navigate('/admin/activity-items')
    if (page === 'timeclock-admin') navigate('/admin/timeclock-logs')
    if (page === 'user-info-upload') navigate('/admin/user-info-upload')
    if (page === 'provision-worker') navigate('/admin/provision-worker')
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const adminPages: { id: AdminPage; label: string }[] = [
    { id: 'allowed-users', label: 'Allowed Users' },
    { id: 'datastream-users', label: 'Datastream Users' },
    { id: 'maintain-student', label: 'Maintain Student List' },
    { id: 'activity-cards', label: 'Activity Cards' },
    { id: 'activity-items', label: 'Activity Items List' },
    { id: 'timeclock-admin', label: 'Timeclock' },
    { id: 'user-info-upload', label: 'User Info Upload' },
    { id: 'provision-worker', label: 'Provision Desk Worker' },
  ]

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Text fw={700} size="xl" c="brand-purple">Residence Life</Text>

        <Group gap="xs">
          {TABS.map(tab => (
            <Button
              key={tab}
              size="xs"
              variant={!isAdminPage && activeTab === tab ? 'filled' : 'default'}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </Button>
          ))}
          {isAdmin && (
            <UnstyledButton onClick={() => setAdminModalOpen(true)}>
              <Group gap={4}>
                <IconSettings size={20} color="gray" />
                <Text size="sm" c="dimmed">Admin</Text>
              </Group>
            </UnstyledButton>
          )}
        </Group>

        <Group gap="xs">
          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <UnstyledButton>
                <Group gap={4}>
                  <Text size="sm">{adminLabel}</Text>
                  <Box
                    w={32} h={32}
                    style={{
                      borderRadius: '50%',
                      backgroundColor: 'var(--mantine-color-brand-purple-6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconDeviceDesktop size={16} color="white" />
                  </Box>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconLogout size={14} />}
                onClick={handleSignOut}
              >
                Sign Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Modal
        opened={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        title="Admin Pages"
        centered
      >
        <Stack gap="xs">
          {adminPages.map(page => (
            <Button
              key={page.id}
              variant="light"
              justify="flex-start"
              onClick={() => handleAdminPageClick(page.id)}
            >
              {page.label}
            </Button>
          ))}
        </Stack>
      </Modal>
    </AppShell.Header>
  )
}