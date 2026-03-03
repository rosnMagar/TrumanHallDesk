import { Box, Container, Grid, Text, Anchor, Stack, Group } from '@mantine/core';

const FOOTER_LINKS = {
  contact: [
    { label: 'HD On-Duty', value: '123-456-7890' },
    { label: 'RA On-Duty', value: '123-456-7890' },
    { label: 'CC On-Duty', value: '123-456-7890' },
  ],
  issues: [
    { label: 'Message Comm. Coordinator', href: '#' },
    { label: 'Building Issue', href: '#' },
    { label: 'ITS Website', href: '#' },
  ],
  links: [
    { label: 'Frequently Asked Questions', href: '#' },
    { label: 'Desk Worker Schedule', href: '#' },
    { label: 'Binder PDF', href: '#' },
  ],
};

function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack gap="xs">
      <Text
        fz="sm"
        fw={400}
        style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
      >
        {title}
      </Text>
      {children}
    </Stack>
  );
}

export function SiteFooter() {
  return (
    <Box
      component="footer"
      style={{
        backgroundColor: '#EBEBEB',
        borderTop: '1px solid #D0D0D0',
        padding: '28px 0 24px',
        marginTop: 'auto',
      }}
    >
      <Container size="lg">
        <Grid columns={12} gutter="xl">
          <Grid.Col span={4}>
            <FooterSection title="Contact Info">
              {FOOTER_LINKS.contact.map(({ label, value }) => (
                <Group key={label} gap="md" justify="space-between" maw={220}>
                  <Text fz="sm" c="dark">{label}</Text>
                  <Anchor href={`tel:${value}`} fz="sm" c="dark" underline="always">
                    {value}
                  </Anchor>
                </Group>
              ))}
            </FooterSection>
          </Grid.Col>

          <Grid.Col span={4}>
            <FooterSection title="Report an Issue">
              <Stack gap={4}>
                {FOOTER_LINKS.issues.map(({ label, href }) => (
                  <Anchor key={label} href={href} fz="sm" c="dark" underline="always">
                    {label}
                  </Anchor>
                ))}
              </Stack>
            </FooterSection>
          </Grid.Col>

          <Grid.Col span={4}>
            <FooterSection title="Useful Links">
              <Stack gap={4}>
                {FOOTER_LINKS.links.map(({ label, href }) => (
                  <Anchor key={label} href={href} fz="sm" c="dark" underline="always">
                    {label}
                  </Anchor>
                ))}
              </Stack>
            </FooterSection>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
