import { Group, Button, Text, Box } from '@mantine/core'
import { AppShell } from '@mantine/core'
import { IconDeviceDesktop } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

export type Tab = 'Inbound' | 'Outbound' | 'Lock-out' | 'Equipment' | 'Timeclock'
export const TABS: Tab[] = ['Inbound', 'Outbound', 'Lock-out', 'Equipment', 'Timeclock']

interface SiteHeaderProps {
  activeTab: Tab
  onTabChange?: (tab: Tab) => void
}

export default function SiteHeader({ activeTab, onTabChange }: SiteHeaderProps) {
  const navigate = useNavigate()

  const handleTabClick = (tab: Tab) => {
    onTabChange?.(tab)
    if (tab === 'Inbound') navigate('/')
    if (tab === 'Outbound') navigate('/outbound')
    if (tab === 'Equipment') navigate('/equipment')
    if (tab === 'Lock-out') navigate('/lockout')
    if (tab === 'Timeclock') navigate('/timeclock')
  }

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Text fw={700} size="xl" c="brand-purple">Residence Life</Text>
        <Group gap="xs">
          {TABS.map(tab => (
            <Button
              key={tab}
              size="xs"
              variant={activeTab === tab ? 'filled' : 'default'}
              // color inherited from theme — no need to specify
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </Button>
          ))}
        </Group>
        <Group gap="xs">
          <Text size="sm">BNB Desk</Text>
          <Box
            w={32} h={32}
            style={{
              borderRadius: '50%',
              backgroundColor: '#42236B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconDeviceDesktop size={16} color="white" />
          </Box>
        </Group>
      </Group>
    </AppShell.Header>
  )
}