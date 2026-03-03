# Residence Life — UI Style Guide
**React (TypeScript) + Mantine UI · v1.0**

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Grid System](#grid-system)
6. [Components](#components)
   - [App Shell & Header](#app-shell--header)
   - [Navigation Tabs](#navigation-tabs)
   - [Footer](#footer)
   - [Cards / Section Containers](#cards--section-containers)
   - [Form Inputs](#form-inputs)
   - [Buttons](#buttons)
   - [Data Tables](#data-tables)
   - [Pagination](#pagination)
   - [Info Panels](#info-panels)
7. [Responsive Behavior](#responsive-behavior)
8. [Theme Configuration](#theme-configuration)

---

## Design Principles

| Principle | Description |
|-----------|-------------|
| **Utilitarian Clarity** | Desk workers process many tasks quickly. Every UI element should be immediately legible with no ambiguity. |
| **Purple-anchored Identity** | A single vivid purple is the only accent color. All interactive affordances use it; decorative use is avoided. |
| **4:3 Primary Target** | Base layout is designed for 1024×768 and 1280×960 screens. Fluid scaling handles other viewports. |
| **Form over Flair** | Animations and decorative elements are absent. Density and scannability take priority. |

---

## Color Palette

### Brand Colors

```ts
// theme/colors.ts
export const brandColors = {
  primary:        '#8B00D4',  // Vivid purple — primary actions, active nav, logo
  primaryHover:   '#7200AE',  // Darker on hover
  primaryLight:   '#F3E5FF',  // Tinted background for selected states

  // Neutral
  background:     '#F7F7F7',  // Page background
  surface:        '#FFFFFF',  // Card/panel background
  border:         '#E0E0E0',  // Input & table borders
  borderStrong:   '#C0C0C0',  // Dividers, section separators

  // Footer
  footerBg:       '#EBEBEB',
  footerBorder:   '#D0D0D0',

  // Text
  textPrimary:    '#1A1A1A',
  textSecondary:  '#666666',
  textPlaceholder:'#AAAAAA',
  textLink:       '#1A1A1A',  // Footer links are underlined black, not purple

  // Status
  statusAvailable: '#1A1A1A',  // ✓ checkmark
  statusUnavail:   '#1A1A1A',  // ✗ x mark (no color change — relies on symbol)
};
```

### Mantine Color Scale Override

```ts
// In createTheme()
colors: {
  brand: [
    '#F3E5FF', // 0 — lightest tint
    '#E0BBFF',
    '#CC90FF',
    '#B865FF',
    '#A43AFF',
    '#9010E8',
    '#8B00D4', // 6 — primary ← primaryShade
    '#7200AE',
    '#5A0089',
    '#3D0060', // 9 — darkest
  ],
},
primaryColor: 'brand',
primaryShade: 6,
```

---

## Typography

The app uses the system sans-serif stack — no custom font is loaded. This keeps it fast and renders consistently on university-managed desktops.

```ts
// In createTheme()
fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
fontFamilyMonospace: '"Courier New", Courier, monospace',
```

### Type Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `xl` / Logo | 22px | 700 | "Residence Life" wordmark |
| `lg` | 18–20px | 700 | Section headings (Mail Processing, Forward Package) |
| `md` (default) | 14–16px | 400 | Body text, labels, table cells |
| `sm` | 13px | 400 | Helper/description text beneath labels |
| `xs` | 12px | 400 | Placeholder text, meta text |

```tsx
// Section heading
<Title order={3} fw={700} fz="lg" mb="xs">
  Mail Processing
</Title>

// Field label
<Text fw={500} fz="sm" mb={4}>
  Resident Name
</Text>

// Helper text
<Text fz="xs" c="dimmed">
  Enter the resident's name as it appears on the shipping label.
</Text>
```

---

## Spacing & Layout

Mantine's default spacing scale (based on `rem`) is used without modification.

| Token | Value | Common Use |
|-------|-------|------------|
| `xs`  | 0.625rem (10px) | Tight gaps, icon margins |
| `sm`  | 0.75rem (12px)  | Between label and input |
| `md`  | 1rem (16px)     | Standard section gap |
| `lg`  | 1.25rem (20px)  | Card internal padding |
| `xl`  | 1.5rem (24px)   | Between major sections |
| `2xl` / custom | 2rem (32px) | Page-level vertical rhythm |

```tsx
// Page wrapper — centers content, caps max width
<Container size="lg" px="md" py="xl">
  {/* page content */}
</Container>
```

The content column never exceeds `1100px` wide. On 4:3 displays at 1280px, the outer padding is ~90px per side.

---

## Grid System

A **12-column vertical grid** underpins all layouts. Mantine's `Grid` component maps directly to this.

```tsx
import { Grid } from '@mantine/core';

// Standard 12-col container
<Grid gutter="md">
  <Grid.Col span={12}>          {/* full width */}
  <Grid.Col span={6}>           {/* half */}
  <Grid.Col span={4}>           {/* third */}
  <Grid.Col span={8}>           {/* two-thirds (main content + sidebar) */}
</Grid>
```

### Common Layout Patterns

**Mail Processing form — split layout:**
```tsx
// Left: form fields (7 cols) | Right: resident info panel (5 cols)
<Grid gutter="lg">
  <Grid.Col span={7}>
    {/* Resident Name, Package Description, Checked In By */}
  </Grid.Col>
  <Grid.Col span={5}>
    <ResidentInfoPanel />
  </Grid.Col>
</Grid>
```

**Equipment Check Out — three equal fields:**
```tsx
// Banner ID | Resident Name | Phone Number (4 cols each)
<Grid gutter="md">
  <Grid.Col span={4}><TextInput label="Banner ID" /></Grid.Col>
  <Grid.Col span={4}><TextInput label="Resident Name" /></Grid.Col>
  <Grid.Col span={4}><TextInput label="Resident Phone Number" /></Grid.Col>
</Grid>
```

**Lock-out — form + instruction panel:**
```tsx
// Left: form (6 cols) | Right: instruction box (6 cols)
<Grid gutter="lg">
  <Grid.Col span={6}>{/* inputs */}</Grid.Col>
  <Grid.Col span={6}><InstructionPanel /></Grid.Col>
</Grid>
```

---

## Components

### App Shell & Header

The header is a flat white bar with a bottom border. No shadow or elevation.

```tsx
// AppShell.tsx
import { AppShell, Group, Text, Avatar, ActionIcon } from '@mantine/core';
import { IconDeviceDesktop } from '@tabler/icons-react';

function ResidenceLifeShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{ height: 56 }}
      footer={{ height: 'auto' }}
      padding={0}
    >
      <AppShell.Header
        style={{
          borderBottom: '1px solid #E0E0E0',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <Group justify="space-between" w="100%">
          {/* Logo — left */}
          <Text
            fw={700}
            fz={22}
            style={{ color: '#8B00D4', letterSpacing: '-0.3px', cursor: 'default' }}
          >
            Residence Life
          </Text>

          {/* Nav — center */}
          <NavTabs />

          {/* User badge — right */}
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
      </AppShell.Header>

      <AppShell.Main bg="#F7F7F7">
        {children}
      </AppShell.Main>

      <AppShell.Footer>
        <SiteFooter />
      </AppShell.Footer>
    </AppShell>
  );
}
```

---

### Navigation Tabs

Nav items are rendered as **pill-shaped buttons in a button group**. The active tab is filled solid purple; inactive tabs are light gray with a subtle border.

```tsx
// NavTabs.tsx
import { Button, Group } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Inbound',   path: '/inbound'   },
  { label: 'Outbound',  path: '/outbound'  },
  { label: 'Lock-out',  path: '/lockout'   },
  { label: 'Equipment', path: '/equipment' },
  { label: 'Timeclock', path: '/timeclock' },
];

function NavTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Group gap={6}>
      {NAV_ITEMS.map(({ label, path }) => {
        const active = pathname.startsWith(path);
        return (
          <Button
            key={path}
            onClick={() => navigate(path)}
            radius="md"
            size="sm"
            variant={active ? 'filled' : 'default'}
            color={active ? 'brand' : undefined}
            styles={{
              root: {
                fontWeight: active ? 600 : 400,
                backgroundColor: active ? '#8B00D4' : '#FFFFFF',
                color: active ? '#FFFFFF' : '#333333',
                border: active ? 'none' : '1px solid #D0D0D0',
                '&:hover': {
                  backgroundColor: active ? '#7200AE' : '#F0F0F0',
                },
              },
            }}
          >
            {label}
          </Button>
        );
      })}
    </Group>
  );
}
```

**Visual states:**

| State    | Background | Text      | Border       |
|----------|------------|-----------|--------------|
| Active   | `#8B00D4`  | `#FFFFFF` | none         |
| Inactive | `#FFFFFF`  | `#333333` | `#D0D0D0`    |
| Hover    | `#F0F0F0`  | `#333333` | `#D0D0D0`    |

---

### Footer

Three equal columns on a light gray background. Section headers are underlined text (not bold). Links are plain underlined text in near-black.

```tsx
// SiteFooter.tsx
import { Box, Container, Grid, Text, Anchor, Stack, Divider } from '@mantine/core';

const FOOTER_LINKS = {
  contact: [
    { label: 'HD On-Duty',  value: '123-456-7890' },
    { label: 'RA On-Duty',  value: '123-456-7890' },
    { label: 'CC On-Duty',  value: '123-456-7890' },
  ],
  issues: [
    { label: 'Message Comm. Coordinator', href: '#' },
    { label: 'Building Issue',            href: '#' },
    { label: 'ITS Website',               href: '#' },
  ],
  links: [
    { label: 'Frequently Asked Questions', href: '#' },
    { label: 'Desk Worker Schedule',       href: '#' },
    { label: 'Binder PDF',                 href: '#' },
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
          {/* Contact Info */}
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

          {/* Report an Issue */}
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

          {/* Useful Links */}
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
```

---

### Cards / Section Containers

Each functional section (Mail Processing, Forward Package, Equipment Check Out, etc.) lives inside a flat white card with a light border and gentle radius.

```tsx
// SectionCard.tsx
import { Paper, Title, Box } from '@mantine/core';

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
```

**Card anatomy:**

```
┌──────────────────────────────────────────────────┐  border: 1px solid #DCDCDC
│  Section Title (fw:700, fz:lg)                   │  border-radius: 4–6px
│  ─────────────────────────────────────────────   │  padding: 24px 32px
│                                                  │  background: #FFFFFF
│  [content grid]                                  │
└──────────────────────────────────────────────────┘
```

---

### Form Inputs

Inputs use Mantine's default `TextInput` / `Select` with a single customization: the focus ring uses the brand purple.

```tsx
// Shared input styles — apply via theme defaultProps
import { TextInput, Select, createTheme } from '@mantine/core';

// In theme configuration:
components: {
  TextInput: TextInput.extend({
    defaultProps: {
      radius: 'sm',
      size: 'sm',
    },
    styles: {
      label: {
        fontWeight: 500,
        fontSize: '13px',
        marginBottom: '4px',
        color: '#1A1A1A',
      },
      description: {
        fontSize: '12px',
        color: '#666666',
        marginBottom: '6px',
      },
      input: {
        borderColor: '#D0D0D0',
        color: '#1A1A1A',
        '&::placeholder': { color: '#AAAAAA' },
        '&:focus': { borderColor: '#8B00D4' },
      },
    },
  }),
  Select: Select.extend({
    defaultProps: { radius: 'sm', size: 'sm' },
  }),
},
```

**Usage pattern:**

```tsx
<TextInput
  label="Resident Name"
  description="Enter the resident's name as it appears on the shipping label."
  placeholder="Last name, first name"
/>

<TextInput
  label="Package Description"
  description="Append A, B, or C to the end of the description."
  placeholder="White Amazon Mailer - B"
/>

<TextInput
  label="Checked In By"
  description="This should be your name or initials."
  placeholder="John Smith"
/>
```

---

### Buttons

Two button variants are used throughout the app.

#### Primary (Filled Purple)

Used for primary form submissions and key actions (Check In and Print Label, Pick Up, Clock Out).

```tsx
<Button
  variant="filled"
  color="brand"
  radius="md"
  size="sm"
  fullWidth  // applied when button spans a card column
>
  Check In and Print Label
</Button>
```

#### Secondary (Outlined / Ghost)

Used for lower-priority actions (Forward).

```tsx
<Button
  variant="default"
  radius="md"
  size="sm"
  style={{
    border: '1px solid #C0C0C0',
    color: '#333333',
    backgroundColor: '#FFFFFF',
  }}
>
  Forward
</Button>
```

**Button size reference:**

| Context          | Size   | Full Width |
|------------------|--------|------------|
| Nav tabs         | `sm`   | No         |
| Table row action | `xs`   | No         |
| Form submission  | `sm`   | Yes (in col) |
| Timeclock CTA    | `md`   | Yes        |

---

### Data Tables

Tables (Outbound packages, Equipment inventory) use Mantine's `Table` component with light grid lines and no zebra striping.

```tsx
// PackageTable.tsx
import { Table, Button, Badge, Group, Text } from '@mantine/core';

interface PackageRow {
  packageId: number;
  building: string;
  tracking: string;
  description: string;
  name: string;
  inDate: string;
  outDate: string | null;
  type: 'pickup' | 'forward';
}

function PackageTable({ rows }: { rows: PackageRow[] }) {
  return (
    <Table
      withColumnBorders
      withRowBorders
      highlightOnHover
      verticalSpacing="xs"
      horizontalSpacing="sm"
      fz="sm"
      style={{ borderColor: '#E0E0E0' }}
    >
      <Table.Thead style={{ backgroundColor: '#FAFAFA' }}>
        <Table.Tr>
          {['Package ID', 'Building', 'Tracking #', 'Description',
            'Name', 'In-date', 'Out-date', 'Action'].map(col => (
            <Table.Th
              key={col}
              style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '13px' }}
            >
              {col}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map(row => (
          <Table.Tr key={row.packageId}>
            <Table.Td>{row.packageId}</Table.Td>
            <Table.Td>{row.building}</Table.Td>
            <Table.Td>{row.tracking}</Table.Td>
            <Table.Td>{row.description}</Table.Td>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.inDate}</Table.Td>
            <Table.Td>{row.outDate ?? ''}</Table.Td>
            <Table.Td>
              {row.type === 'pickup' ? (
                <Button size="xs" variant="filled" color="brand" radius="md">
                  Pick Up
                </Button>
              ) : (
                <Button
                  size="xs"
                  variant="default"
                  radius="md"
                  style={{ border: '1px solid #C0C0C0' }}
                >
                  Forward
                </Button>
              )}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
```

**Table style rules:**

- Column borders: `1px solid #E0E0E0`
- Row borders: `1px solid #E0E0E0`
- Header background: `#FAFAFA`
- Row hover: Mantine default (`#F5F5F5`)
- No alternating row colors
- Action column is always the rightmost column

---

### Pagination

Standard centered pagination. Active page uses filled brand purple.

```tsx
import { Pagination, Group } from '@mantine/core';
import { useState } from 'react';

function TableFooter({ total }: { total: number }) {
  const [page, setPage] = useState(1);

  return (
    <Group justify="center" mt="md">
      <Pagination
        value={page}
        onChange={setPage}
        total={total}
        siblings={1}
        boundaries={1}
        color="brand"
        radius="sm"
        size="sm"
      />
    </Group>
  );
}
```

---

### Info Panels

Readonly display panels (Resident Information box on Inbound, Desk Attendant Instructions on Lock-out). Outlined box, no fill, slightly tighter padding.

```tsx
// InfoPanel.tsx
import { Box, Title, Text, Stack } from '@mantine/core';

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

// Resident Information variant (auto-populated read-only fields)
export function ResidentInfoPanel({
  name, building, room,
}: { name?: string; building?: string; room?: string }) {
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

function ReadonlyField({ value, placeholder }: { value?: string; placeholder: string }) {
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
```

---

## Responsive Behavior

The app is designed **primarily for 4:3 desktop displays** (1024×768 and 1280×960). Responsive breakpoints provide graceful degradation, not a mobile-first rewrite.

| Breakpoint | Width     | Behavior |
|------------|-----------|----------|
| `xl`       | ≥ 1280px  | Full layout — target viewport |
| `lg`       | ≥ 1024px  | Full layout — minimum supported |
| `md`       | ≥ 768px   | Nav tabs wrap; forms stack to single column |
| `sm`       | ≥ 576px   | Footer columns stack 2-up then 1-up |
| `xs`       | < 576px   | Single column; nav becomes a select dropdown |

```tsx
// Responsive grid — form cols collapse on small screens
<Grid gutter="lg">
  <Grid.Col span={{ base: 12, md: 7 }}>
    {/* Form fields */}
  </Grid.Col>
  <Grid.Col span={{ base: 12, md: 5 }}>
    <ResidentInfoPanel />
  </Grid.Col>
</Grid>

// Responsive footer — three columns on desktop, stacked on mobile
<Grid columns={12} gutter="xl">
  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
    {/* Contact Info */}
  </Grid.Col>
  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
    {/* Report an Issue */}
  </Grid.Col>
  <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
    {/* Useful Links */}
  </Grid.Col>
</Grid>
```

---

## Theme Configuration

Complete Mantine theme object to drop into `MantineProvider`.

```tsx
// theme/index.ts
import { createTheme, MantineTheme, TextInput, Select, Button } from '@mantine/core';

export const theme = createTheme({
  // ─── Core ─────────────────────────────────────────────────────────────────
  primaryColor: 'brand',
  primaryShade: 6,
  defaultRadius: 'sm',

  // ─── Colors ───────────────────────────────────────────────────────────────
  colors: {
    brand: [
      '#F3E5FF',
      '#E0BBFF',
      '#CC90FF',
      '#B865FF',
      '#A43AFF',
      '#9010E8',
      '#8B00D4',  // ← primaryShade: 6
      '#7200AE',
      '#5A0089',
      '#3D0060',
    ],
  },

  // ─── Typography ───────────────────────────────────────────────────────────
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.8125rem', // 13px
    md: '0.875rem',  // 14px
    lg: '1rem',      // 16px
    xl: '1.125rem',  // 18px
  },
  lineHeights: {
    xs: '1.3',
    sm: '1.4',
    md: '1.5',
    lg: '1.6',
    xl: '1.7',
  },

  // ─── Spacing ──────────────────────────────────────────────────────────────
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.25rem',  // 20px
    xl: '1.5rem',   // 24px
  },

  // ─── Components ───────────────────────────────────────────────────────────
  components: {
    TextInput: TextInput.extend({
      defaultProps: { radius: 'sm', size: 'sm' },
      styles: {
        label: { fontWeight: 500, marginBottom: '4px' },
        description: { marginBottom: '6px' },
      },
    }),

    Select: Select.extend({
      defaultProps: { radius: 'sm', size: 'sm' },
    }),

    Button: Button.extend({
      defaultProps: { radius: 'md' },
    }),

    Paper: {
      defaultProps: {
        radius: 'sm',
        withBorder: true,
      },
      styles: {
        root: { borderColor: '#DCDCDC' },
      },
    },

    Table: {
      defaultProps: {
        withColumnBorders: true,
        withRowBorders: true,
        highlightOnHover: true,
        verticalSpacing: 'xs',
        horizontalSpacing: 'sm',
        fz: 'sm',
      },
    },
  },

  // ─── Other ────────────────────────────────────────────────────────────────
  focusRing: 'auto',    // show focus ring only on keyboard navigation
  cursorType: 'pointer',
});
```

```tsx
// main.tsx
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
```

---

*End of Style Guide — Residence Life v1.0*
