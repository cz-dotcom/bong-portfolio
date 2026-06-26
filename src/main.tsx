import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { ContactModalProvider } from './context/ContactModalContext'
import { preloadHeroAssets } from './lib/preloadHeroAssets'
import './index.css'

preloadHeroAssets()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ContactModalProvider>
        <App />
      </ContactModalProvider>
    </ErrorBoundary>
  </StrictMode>,
)
