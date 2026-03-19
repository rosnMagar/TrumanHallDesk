import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import App from './App'

Amplify.configure(outputs)

const theme = createTheme({
  primaryColor: 'grape',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)