import { AppShell, Stack, Text, Group, Anchor } from '@mantine/core';

const contactInfo: [string, string][] = [
  ['HD On-Duty', '263-456-7890'],
  ['RA On-Duty', '263-456-7890'],
  ['CC On-Duty', '263-456-7890'],
];

//Replace the '#' in the href with the actual links when we have them look at ITS website for example
const reportLinks: [string, string][] = [
  ['Message Comm. Coordinator', '#'],
  ['Building Issue', '#'],
  ['ITS Website', 'https://its.truman.edu/'],
];

const usefulLinks: [string, string][] = [
  ['Frequently Asked Questions', '#'],
  ['Desk Worker Schedule', '#'],
  ['Binder PDF', '#'],
];

export default function SiteFooter() {
  return (
    <AppShell.Footer bg="gray.2" p="md">
      <Group justify="space-around" maw={1200} mx="auto" align="flex-start">
        <Stack gap={4}>
          <Text fw={700} size="sm">Contact Info</Text>
          {contactInfo.map(([role, num]) => (
            <Group key={role} gap="lg">
              <Text size="xs" c="dimmed" w={80}>{role}</Text>
              <Anchor href={`tel:${num}`} size="xs">{num}</Anchor>
            </Group>
          ))}
        </Stack>
        <Stack gap={4}>
          <Text fw={700} size="sm">Report an Issue</Text>
          {reportLinks.map(([label, href]) => (
            <Anchor key={label} href={href} size="xs" target="_blank" rel="noreferrer">
              {label}
            </Anchor>
          ))}
        </Stack>
        <Stack gap={4}>
          <Text fw={700} size="sm">Useful Links</Text>
          {usefulLinks.map(([label, href]) => (
            <Anchor key={label} href={href} size="xs" target="_blank" rel="noreferrer">
              {label}
            </Anchor>
          ))}
        </Stack>
      </Group>
    </AppShell.Footer>
  );
}