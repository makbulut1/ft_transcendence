import { ChatMessage } from '@/_Mock/chat/dummyChat'
import { MessageList } from '@/modules/chat/lists'

interface MessageListProps {
  messages: ChatMessage[],
}

const ChatWindowBody = ({messages} : MessageListProps) => {
  return (
    <>
      <MessageList messages={messages} />
    </>
  )
}

export { ChatWindowBody }