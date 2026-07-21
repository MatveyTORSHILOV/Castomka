import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ScrollProgressProvider } from './hooks/useScrollProgress'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScrollProgressProvider>
      <App />
    </ScrollProgressProvider>
  </StrictMode>,
)
