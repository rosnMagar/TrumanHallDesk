import { AppShell, Stack } from '@mantine/core'
import SiteHeader, { type Tab } from './SiteHeader'
import SiteFooter from './SiteFooter'

interface PageLayoutProps {
  activeTab: Tab
  onTabChange?: (tab: Tab) => void
  isAdminPage?: boolean
  children: React.ReactNode
}

export default function PageLayout({ activeTab, onTabChange, isAdminPage = false, children }: PageLayoutProps) {
  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={onTabChange} isAdminPage={isAdminPage} />
      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">
          {children}
        </Stack>
      </AppShell.Main>
      <SiteFooter />
    </AppShell>
  )
}