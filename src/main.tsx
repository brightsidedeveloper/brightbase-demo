import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrightQueryProvider } from 'brightside-developer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrightQueryProvider>
      <App />
    </BrightQueryProvider>
  </StrictMode>
)
