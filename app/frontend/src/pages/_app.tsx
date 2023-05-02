import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'

import { ModalController } from '@/components/Modals'
import setupAxiosInterceptors from '@/configs/axios.interceptor'

const queryClient = new QueryClient()

setupAxiosInterceptors(() => {
  console.log('on unauthenticated')
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalController />
        <Component {...pageProps} />
    </QueryClientProvider>
  )
}
