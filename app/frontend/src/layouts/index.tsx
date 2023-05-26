import React from 'react'

import { Header } from '@/layouts/Header'


const Layout = ({children} : {children : React.ReactNode | React.ReactNode[]}) =>{

  return (
    <div className="w-full h-[100vh] bg-baklavaBlack-300">
      <Header />
      {children}
      </div>
  )
}

export { Header,Layout }