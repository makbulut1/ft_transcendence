import { ChatMessage } from '@/_Mock/chat/dummyChat'
import { ChatWindowBody, ChatWindowFooter, ChatWindowHeader } from '@/modules/chat/modules/modules'

const ChatBoxBody = (props: {
  fullname: string
  userListItemDisplay: (value: ((prevState: boolean | null) => boolean | null) | boolean | null) => void
  messages: ChatMessage[]
  sendMessage: (message: string) => void
}) => (
  <div className="h-full  w-full max-w-[1280px] border-l-[0.1rem] border-gray-600 ">
    <ChatWindowHeader fullname={props.fullname} setUserListItemDisplay={props.userListItemDisplay} />
    <ChatWindowBody messages={props.messages} />
    <div className="px-2 pb-2">
      <ChatWindowFooter sendMessage={props.sendMessage} />
    </div>
  </div>
)

export { ChatBoxBody }
