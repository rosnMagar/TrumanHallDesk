import { AppShell, SimpleGrid, Stack, Text, Group, Anchor } from '@mantine/core';

const contactInfo: [string, string][] = [
  ['HD On-Duty', '263-456-7890'],
  ['RA On-Duty', '263-456-7890'],
  ['CC On-Duty', '263-456-7890'],
];
const reportLinks = ['Message Comm. Cordinator', 'Building Issue', 'ITS Website'];
const usefulLinks = ['Frequently Asked Questions', 'Desk Worker Schedule', 'Binder PDF'];

export default function SiteFooter() {
  return (
    <AppShell.Footer bg="gray.2" p="md">
      <SimpleGrid cols={3} spacing={100} maw={900} mx="auto">
        <Stack gap={4}>
          <Text fw={700} size="sm">Contact Info</Text>
          {contactInfo.map(([role, num]) => (
            <Group key={role} gap="lg">
              <Text size="xs" c="dimmed" w={80}> {role} </Text>
              <Anchor href={`tel:${num}`} size="xs">{num}</Anchor>
            </Group>
          ))}
        </Stack>
        <Stack gap={4}>
          <Text fw={700} size="sm">Report an Issue</Text>
          {reportLinks.map(l => (
            <Anchor key={l} href="#" size="xs">
              {l}
            </Anchor>
          ))}
        </Stack>
        <Stack gap={4}>
          <Text fw={700} size="sm">Useful Links</Text>
          {usefulLinks.map(l => (
            <Anchor key={l} href="#" size="xs">
              {l}
            </Anchor>
          ))}
        </Stack>
      </SimpleGrid>
    </AppShell.Footer>
  );
}
