import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrightProvider } from 'brightside-developer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrightProvider>
      <App />
    </BrightProvider>
  </StrictMode>
)
