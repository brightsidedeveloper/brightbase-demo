import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { BrightQueryProvider } from 'brightbase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrightQueryProvider>
      <App />
    </BrightQueryProvider>
    <Toaster />
  </StrictMode>
)
