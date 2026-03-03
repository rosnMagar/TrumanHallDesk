import { AppShell as MantineAppShell, Group, Text, ActionIcon } from '@mantine/core';
import { IconDeviceDesktop } from '@tabler/icons-react';
import { NavTabs } from './NavTabs';
import { SiteFooter } from './SiteFooter';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <MantineAppShell
      header={{ height: 56 }}
      footer={{ height: 'auto' }}
      padding={0}
    >
      <MantineAppShell.Header
        style={{
          borderBottom: '1px solid #E0E0E0',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <Group justify="space-between" w="100%">
          <Text
            fw={700}
            fz={22}
            style={{ color: '#8B00D4', letterSpacing: '-0.3px', cursor: 'default' }}
          >
            Residence Life
          </Text>

          <NavTabs />

          <Group gap="xs">
            <Text fz="sm" fw={500} c="dark">BNB Desk</Text>
            <ActionIcon
              variant="filled"
              color="brand"
              radius="xl"
              size="lg"
              aria-label="Desk terminal"
            >
              <IconDeviceDesktop size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Main bg="#F7F7F7">
        {children}
      </MantineAppShell.Main>

      <MantineAppShell.Footer>
        <SiteFooter />
      </MantineAppShell.Footer>
    </MantineAppShell>
  );
}
