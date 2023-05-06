import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const url = process.env.INTRA_URL
// interface ILoginReturn {
//   id: number
//   token: string
//   fullName: string
//   secretAscii: string
//   qrCode: string
// }

export default function Home() {
  const [qr, setQr] = useState<string>('')

  const router = useRouter()

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-baklavaBlack-200 ">
        <div className="text-body-test relative p-0.5 ">
          <div className="relative z-10 h-full w-full bg-baklavaBlack-200 duration-700 active:brightness-200">
            <a href={url} >
              <button className="text-body-test border-2 border-transparent bg-clip-text p-2 font-sans text-8xl font-extrabold text-transparent">
                LOGIN
              </button>
            </a>
          </div>
          <div className="text-body-test absolute -left-[3.5rem] -top-[0.5rem] h-36 w-[28rem] blur-2xl"></div>
        </div>
      </div>
    </>
  )
}
