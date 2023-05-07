import { useEffect, useState } from 'react'

import { ChatMessage, chatMessages } from '@/_Mock/chat/dummyChat'
import { MessageList } from '@/modules/chat/lists'
import { UserListItem } from '@/modules/chat/modules'
import { ChatWindowFooter, ChatWindowHeader } from '@/modules/chat/modules/components'

const ChatBox = () => {
  const [chatMessagesState, setChatMessagesState] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (chatMessagesState.length > 0) return
    const reversedItems = [...chatMessages];
    setChatMessagesState(reversedItems.reverse())
  }, [])

  const handleSendMessage = (message: string) => {
    chatMessages.push({
      id: chatMessages.length + 1,
      senderId: 1,
      receiverId: 2,
      message: message,
      timestamp: new Date(),
      isRead: false,
      isDeleted: false,
    })
    const reversedItems = [...chatMessages];
    setChatMessagesState(reversedItems.reverse())
  }
  console.log(chatMessagesState)


  //Variables
  const fullname = "Eren Akbulut"

  return (
    <div className="flex bg-baklavaBlack-200 h-fit max-h-[60vh] shadow-baklavaBlack-200 shadow-2xl rounded-xl">
      <div className=" w-[25rem]"><UserListItem/> </div>
      <div className="w-[75rem] border-l-[0.1rem] border-gray-600 h-full ">
        <ChatWindowHeader fullname={fullname} />
        <MessageList messages={chatMessagesState} />
        <div className="pb-2 px-2"><ChatWindowFooter sendMessage={handleSendMessage} /></div>
      </div>
    </div>
  )
}

export default ChatBox
