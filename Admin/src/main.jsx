import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AdminAuthProvider } from './Context/AdminAuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
    <App />
    </AdminAuthProvider>
  </StrictMode>,
)
