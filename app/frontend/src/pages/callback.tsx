import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Layout } from '@/layouts'
import { useStoreUser } from '@/store'
import { IUser } from '@/types'

const sendCode = async (code: string) => {
  const userData = await axios.post('http://localhost:3000/api/callbackBE', {
    code: code,
  })
  return userData.data as IUser
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
