import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import VennDiagram from './VennDiagram.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <VennDiagram/>
  </StrictMode>,
)
