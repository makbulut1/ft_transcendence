import { ChatWindowBody, ChatWindowFooter, ChatWindowHeader } from '@/modules/chat/modules/components'

const ChatWindow = () => {
  return (
    <div className="flex w-full  flex-col  bg-baklavaBlack-200 pb-6">
      <ChatWindowHeader />
        <ChatWindowBody />
      <div className="px-6 ">
        <ChatWindowFooter />
      </div>
    </div>
  )
}

export { ChatWindow }
