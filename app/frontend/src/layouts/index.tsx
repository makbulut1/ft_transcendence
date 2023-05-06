import React from 'react'

import { Header } from '@/layouts/Header'


const Layout = ({children} : {children : React.ReactNode | React.ReactNode[]}) =>{

  return (
    <div className="w-full h-screen bg-baklavaBlack-300">
      <Header />
      <main className="w-full">{children}</main>
      </div>
  )
}

export { Header,Layout }