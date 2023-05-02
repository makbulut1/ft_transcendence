import Image from 'next/image'
import React from 'react'

const ProfilePhoto = (props: { show: boolean | undefined; src: string; alt: string, size?: number}) => (
  <div className={` ${props.show ? '' : 'w-12 h-10 c:hidden'} `}>
    <Image src={props.src} alt={props.alt} width={props.size || 50} height={props.size || 50}
           className="rounded-full" />
  </div>
)

export { ProfilePhoto }
