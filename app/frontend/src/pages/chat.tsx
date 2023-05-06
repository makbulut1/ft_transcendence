import { Layout } from '@/layouts'
import ChatBox from '@/modules/chat/ChatBox'

const ChatPage = () => {
  return <Layout>
    <div className="flex h-full w-full justify-center p-20 "><ChatBox /></div>
  </Layout>
}

export default ChatPage
