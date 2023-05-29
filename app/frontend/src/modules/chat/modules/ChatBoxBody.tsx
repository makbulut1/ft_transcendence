import { ChatWindowBody, ChatWindowFooter, ChatWindowHeader } from '@/modules/chat/modules/modules'

const ChatBoxBody = (props: {
  fullname: string
  userListItemDisplay: (value: ((prevState: boolean | null) => boolean | null) | boolean | null) => void
}) => (
  <div className="h-full  w-full max-w-[1280px] border-l-[0.1rem] border-gray-600 ">
    <ChatWindowHeader fullname={props.fullname} setUserListItemDisplay={props.userListItemDisplay} />
    <ChatWindowBody />
    <div className="px-2 pb-2">
      <ChatWindowFooter  />
    </div>
  </div>
)

export { ChatBoxBody }
