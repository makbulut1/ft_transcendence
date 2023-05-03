import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ProfilePhoto = (props: { show: boolean | undefined; src: string; alt: string, size?: number}) => {

  const [qr, setQr] = useState<string>('')

  useEffect(() => {
    setQr(props.src)
  }, [props.src]
  )

  return (
  <>
    { qr.length === 0 ? <></> :
  <div className={` ${props.show ? '' : 'w-12 h-10 c:hidden'} `}>
    <Image src={qr} alt={`alt`} width={props.size || 50} height={props.size || 50}
           className='rounded-full' />
  </div>
}
  </>
  )
}
export { ProfilePhoto }
