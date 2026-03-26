import { createTheme, type MantineThemeOverride } from '@mantine/core'

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'brand-purple',
  primaryShade: 6,
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',

  colors: {
    'brand-purple': Array(10).fill('#510C76') as any,
    'brand-blue': Array(10).fill('#00A8E2') as any,
  },

  components: {
    Button: {
      defaultProps: {
        color: 'brand-purple',
      },
    },
  },
})