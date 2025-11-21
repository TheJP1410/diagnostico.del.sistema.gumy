import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- NOTA IMPORTANTE PARA TU PROYECTO ---
// En tu computadora, DEBES usar la línea real de abajo:
// import { Analytics } from '@vercel/analytics/react';

// (Para que esta vista previa no falle, yo uso este "falso" Analytics aquí)
const Analytics = () => null; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)