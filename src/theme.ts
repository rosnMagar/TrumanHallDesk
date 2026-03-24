import { createTheme, type MantineThemeOverride } from '@mantine/core'

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'brand-purple',
  primaryShade: 6,
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',

  colors: {
    'brand-purple': Array(10).fill('rgb(81, 11, 118)') as any,
    'brand-blue': Array(10).fill('#5CA6DD') as any,
  },

  components: {
    Button: {
      defaultProps: {
        color: 'brand-purple',
      },
    },
  },
})