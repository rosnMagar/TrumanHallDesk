import type { ReactNode } from 'react'
import { Paper, Title } from '@mantine/core'
import type { TitleOrder } from '@mantine/core'

interface FormCardProps {
  title: string
  titleOrder?: TitleOrder
  children: ReactNode
  style?: React.CSSProperties
}

export default function FormCard({ title, titleOrder = 4, children, style }: FormCardProps) {
  return (
    <Paper withBorder shadow="xs" p="xl" radius="md" style={style}>
      <Title order={titleOrder} mb="lg">{title}</Title>
      {children}
    </Paper>
  )
}
