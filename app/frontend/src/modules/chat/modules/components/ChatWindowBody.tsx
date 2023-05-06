import { MessageList } from '@/modules/chat/lists'

const ChatWindowBody = () => {
  return (
    <div>
      <MessageList messages={[]} />
    </div>
  )
}

export { ChatWindowBody }