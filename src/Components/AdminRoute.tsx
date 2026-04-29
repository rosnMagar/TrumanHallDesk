import { Navigate } from 'react-router-dom'
import { Center, Loader, Text, Stack } from '@mantine/core'
import { useAdmin } from '../context/AdminContext'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="sm">
          <Loader color="brand-purple" size="lg" />
          <Text c="dimmed" size="sm">Verifying access...</Text>
        </Stack>
      </Center>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
