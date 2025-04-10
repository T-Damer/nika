import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import App from '@/App'
import '@/index.css'
import '@/lib/i18n'
import { queryClient } from '@/lib/queryClient'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </HashRouter>
)
