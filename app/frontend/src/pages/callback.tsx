import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Layout } from '@/layouts'
import { useStoreUser } from '@/store'

const sendCode = async (code: string) => {
  // const userData = await axios.post('callback', {
  //   code: code,
  // })
  const authData: any = await axios.post('https://api.intra.42.fr/oauth/token', {
    grant_type: 'authorization_code',
    client_id: 'u-s4t2ud-240411a646735096c38638f3719456168613f906bbd4a1a94fa2a949cf943638',
    client_secret: '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',
    code: code,
    redirect_uri: 'http://localhost:3000/callback',
  })
  console.log('authData', authData)
  const user = await axios.get('https://api.intra.42.fr/v2/me', {
    headers: {
      Authorization: `Bearer ${authData?.data?.access_token}`,
    },
  })
  console.log('user', user)
  return {
    id: user?.data?.id,
    token: authData?.data?.access_token,
    fullName: user?.data?.usual_full_name,
    email: user?.data?.email,
    login: user?.data?.login,
  }
}

const CallbackPage = () => {
  const router = useRouter()
  const [code, setCode] = useState<string>('')

  const {authenticate, authenticated} = useStoreUser()

  useEffect(() => {
    if (authenticated) router.push('/home')
    const { code } = router.query
    if (code) setCode(code as string)
  }, [authenticated, router, router.query])

  const handleClick = async () => {
    await sendCode(code as string).then(res => {
      authenticate(res)
      router.push('/home')
    })
      .catch(err => {
        console.log(err) // TODO: handle error with toast ...
      })
  }

  return (
    <Layout>
      <h1>Callback Page</h1>
      <button className="text-white" onClick={handleClick}>Send Code</button><br/>
      {/*<button onClick={() => {console.log(JSON.parse(localStorage.getItem("user") ?? ""))}}>Write user data</button>*/}
    </Layout>
  )
}

export default CallbackPage
