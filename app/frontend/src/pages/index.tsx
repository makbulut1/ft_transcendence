import axios from 'axios'
import { useState } from 'react'

const url =
  'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2bfb79667cee369f84ff6967104ee61277be6f58cedeb832183a259967e47f11&' +
  'redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code'
interface ILoginReturn {
  id: number
  token: string
  fullName: string
  secretAscii: string
  qrCode: string
}

export default function Home() {
  const [qr, setQr] = useState<string>('')

  const handleLogin = async () => {
    // const data = await axios.get(url) as ILoginReturn
    // console.log(data)
    // setQr(data.qrCode)
    const data = (await axios.get('64.226.97.1:3000/callback')) as ILoginReturn
    console.log(data)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-baklavaBlack-200 ">
      <div className="text-body-test relative p-0.5 ">
        <div className="relative z-10 h-full w-full bg-baklavaBlack-200 duration-700 active:brightness-200">
          {qr.length === 0 ? (
            <a href={url} target="_blank">
              <button
                className="text-body-test border-2 border-transparent bg-clip-text p-2 font-sans text-8xl font-extrabold text-transparent"
                onClick={handleLogin}
              >
                LOGIN
              </button>
            </a>
          ) : (
            <img src={qr} alt="qr" width={300} height={300} />
          )}
        </div>
        <div className="text-body-test absolute -left-[3.5rem] -top-[0.5rem] h-36 w-[28rem] blur-2xl"></div>
      </div>
    </div>
  )
}
