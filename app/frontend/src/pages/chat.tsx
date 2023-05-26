import { Layout } from '@/layouts'
import ChatBox from '@/modules/chat/ChatBox'

const ChatPage = () => {
  return <Layout>
    <div className="flex w-full h-fit justify-center "><ChatBox /></div>
  </Layout>
}

export default ChatPage
