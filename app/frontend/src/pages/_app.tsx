import '@/styles/globals.css'

import type { AppProps } from 'next/app'

import { ModalController } from '@/components/Modals'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ModalController />
      <Component {...pageProps} />
    </>
  )
}
