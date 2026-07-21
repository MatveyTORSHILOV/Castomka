import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { SceneInputProvider } from './hooks/useSceneInput'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SceneInputProvider>
      <App />
    </SceneInputProvider>
  </StrictMode>,
)
