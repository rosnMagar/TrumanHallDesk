import { Button, Group } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Inbound', path: '/inbound' },
  { label: 'Outbound', path: '/outbound' },
  { label: 'Lock-out', path: '/lockout' },
  { label: 'Equipment', path: '/equipment' },
  { label: 'Timeclock', path: '/timeclock' },
];

export function NavTabs() {
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
