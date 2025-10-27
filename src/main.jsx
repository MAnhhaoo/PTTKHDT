import { StrictMode } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'
import { store } from '../src/redux/store.js'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
     <QueryClientProvider client={queryClient}>    <Provider store={store}>  <StrictMode>
    <App />
  </StrictMode>
  </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>


  ,

)
