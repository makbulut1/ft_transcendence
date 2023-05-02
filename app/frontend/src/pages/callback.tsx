import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const sendCode = async () => {
  const data = await axios.get('helloWorld')
  console.log(data)
}

const CallbackPage = () => {
  const router = useRouter()

  useEffect(() => {
    const { code } = router.query
    console.log(code)
    sendCode()
  }, [router.query])

  return (
    <div>
      <h1>Callback Page</h1>
    </div>
  )
}

export default CallbackPage
