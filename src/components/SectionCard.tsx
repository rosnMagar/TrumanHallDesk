import { Paper, Title } from '@mantine/core';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Paper
      radius="sm"
      withBorder
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #DCDCDC',
        padding: '24px 32px',
        marginBottom: '24px',
      }}
    >
      <Title order={3} fw={700} fz="lg" mb="lg" c="dark">
        {title}
      </Title>
      {children}
    </Paper>
  );
}
