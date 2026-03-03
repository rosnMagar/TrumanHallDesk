import { createTheme, TextInput, Select, Button } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 6,
  defaultRadius: 'sm',

  colors: {
    brand: [
      '#F3E5FF',
      '#E0BBFF',
      '#CC90FF',
      '#B865FF',
      '#A43AFF',
      '#9010E8',
      '#8B00D4',
      '#7200AE',
      '#5A0089',
      '#3D0060',
    ],
  },

  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  fontFamilyMonospace: '"Courier New", Courier, monospace',
  fontSizes: {
    xs: '0.75rem',
    sm: '0.8125rem',
    md: '0.875rem',
    lg: '1rem',
    xl: '1.125rem',
  },
  lineHeights: {
    xs: '1.3',
    sm: '1.4',
    md: '1.5',
    lg: '1.6',
    xl: '1.7',
  },

  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },

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

  focusRing: 'auto',
  cursorType: 'pointer',
});

export const brandColors = {
  primary: '#8B00D4',
  primaryHover: '#7200AE',
  primaryLight: '#F3E5FF',
  background: '#F7F7F7',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  borderStrong: '#C0C0C0',
  footerBg: '#EBEBEB',
  footerBorder: '#D0D0D0',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textPlaceholder: '#AAAAAA',
  textLink: '#1A1A1A',
  statusAvailable: '#1A1A1A',
  statusUnavail: '#1A1A1A',
};
