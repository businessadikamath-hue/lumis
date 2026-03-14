import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/tokens.css'
import './styles/global.css'
import './styles/glass.css'
import './styles/typography.css'

// Add Google Fonts to document head
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap';
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
