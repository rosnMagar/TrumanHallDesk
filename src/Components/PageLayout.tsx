import { AppShell, Stack } from '@mantine/core'
import SiteHeader, { type Tab } from './SiteHeader'
import SiteFooter from './SiteFooter'

interface PageLayoutProps {
  activeTab: Tab
  onTabChange?: (tab: Tab) => void
  isAdminPage?: boolean
  adminLabel?: string
  children: React.ReactNode
}

export default function PageLayout({ activeTab, onTabChange, isAdminPage = false, adminLabel, children }: PageLayoutProps) {
  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={onTabChange} isAdminPage={isAdminPage} adminLabel={adminLabel} />
      <AppShell.Main
        bg="gray.1"
        style={{
          height: 'calc(100vh - 56px - 100px)',
          overflowY: 'auto',
        }}
      >
        <Stack p="xl" maw={900} mx="auto" gap="lg">
          {children}
        </Stack>
      </AppShell.Main>
      <SiteFooter />
    </AppShell>
  )
}