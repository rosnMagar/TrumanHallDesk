import { Box, Text, Stack } from '@mantine/core';

interface InfoPanelProps {
  title: string;
  children: React.ReactNode;
}

export function InfoPanel({ title, children }: InfoPanelProps) {
  return (
    <Box
      style={{
        border: '1px solid #DCDCDC',
        borderRadius: '6px',
        padding: '16px 20px',
        backgroundColor: '#FAFAFA',
        height: '100%',
      }}
    >
      <Text fw={600} fz="sm" mb="sm" c="dark">
        {title}
      </Text>
      {children}
    </Box>
  );
}

export function ResidentInfoPanel({
  name,
  building,
  room,
}: {
  name?: string;
  building?: string;
  room?: string;
}) {
  return (
    <InfoPanel title="Resident Information">
      <Stack gap="xs">
        <ReadonlyField value={name} placeholder="Name" />
        <ReadonlyField value={building} placeholder="Building" />
        <ReadonlyField value={room} placeholder="Room Number" />
      </Stack>
    </InfoPanel>
  );
}

function ReadonlyField({
  value,
  placeholder,
}: {
  value?: string;
  placeholder: string;
}) {
  return (
    <Box
      style={{
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        padding: '7px 12px',
        backgroundColor: '#F5F5F5',
        minHeight: '36px',
      }}
    >
      <Text fz="sm" c={value ? 'dark' : 'dimmed'}>
        {value ?? placeholder}
      </Text>
    </Box>
  );
}
