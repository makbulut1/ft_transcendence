import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Header } from '@/layouts'

const sendCode = async (code: string) => {
  const authData: any = await axios.post('https://api.intra.42.fr/oauth/token', {
    grant_type: 'authorization_code',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
  })
  console.log('authData', authData)
  const user = await axios.get('https://api.intra.42.fr/v2/me', {
    headers: {
      Authorization: `Bearer ${authData?.data?.access_token}`,
    },
  })
  console.log('user', user)
  const returnUser = await axios.post('callback', {
    id: user?.data?.id,
    token: authData?.data?.access_token,
    fullName: user?.data?.usual_full_name,
    email: user?.data?.email,
    login: user?.data?.login,
  })
  localStorage.setItem("user", JSON.stringify(returnUser.data))
  window.location.reload()
  return returnUser
}

const CallbackPage = () => {

  const router = useRouter()
  const [code, setCode] = useState<string>('')

  useEffect(() => {
    const { code } = router.query
    if (code) setCode(code as string)
  }, [router.query])

  const handleClick = async () => {
    await sendCode(code as string).then(res => {
      console.log("res", res)
    })
  }

  return (
    <div className="w-full h-screen">
      <Header />
      <h1>Callback Page</h1>
      <button onClick={handleClick}>Send Code</button><br/>
      <button onClick={() => {console.log(JSON.parse(localStorage.getItem("user") ?? ""))}}>Write user data</button>
    </div>
  )
}

export default CallbackPage
