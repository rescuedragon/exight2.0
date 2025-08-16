import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import './index.css'

// Debug hooks to visualize mount progress in production when needed
function updateBootCheck(message: string) {
  try {
    const el = document.getElementById('boot-check')
    if (el) {
      el.textContent = message
    }
  } catch {
    // no-op
  }
}

try {
  updateBootCheck('Mounting React...')
  const rootEl = document.getElementById('root')
  if (!rootEl) {
    throw new Error('Root element not found')
  }
  const root = createRoot(rootEl)
  root.render(
    <StrictMode>
      <HashRouter>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <App />
        </ThemeProvider>
      </HashRouter>
    </StrictMode>,
  )
  updateBootCheck('React mounted ✓')
} catch (err) {
  // Surface any unexpected render errors in production
  const msg = err instanceof Error ? err.message : String(err)
  updateBootCheck('React mount failed: ' + msg)
  // Also write a minimal fallback content so page isn’t blank
  const rootEl = document.getElementById('root')
  if (rootEl) {
    rootEl.innerHTML = '<div style="padding:12px;color:#991b1b;background:#fff0f3;border:1px solid #fecaca;border-radius:8px;">Failed to load app. ' + msg + '</div>'
  }
}
