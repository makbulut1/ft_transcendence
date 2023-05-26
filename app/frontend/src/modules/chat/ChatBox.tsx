import { useEffect, useState} from 'react'

import { ChatMessage, chatMessages } from '@/_Mock/chat/dummyChat'
import { UserListItem } from '@/modules/chat/modules'
import { ChatWindowBody, ChatWindowFooter, ChatWindowHeader } from '@/modules/chat/modules/components'

const ChatBox = () => {
  const [chatMessagesState, setChatMessagesState] = useState<ChatMessage[]>([])
  const [userListItemDisplay, setUserListItemDisplay] = useState<boolean | null>(null)

  useEffect(() => {
    if (chatMessagesState.length > 0) return
    const reversedItems = [...chatMessages]
    setChatMessagesState(reversedItems.reverse())
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setUserListItemDisplay(false);
    };

    // Initial check
    if (window.innerWidth > 1024){handleResize();}

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    const reversedItems = [...chatMessages]
    setChatMessagesState(reversedItems.reverse())
  }

  //Variables
  const fullname = 'Eren Akbulut'

  return (
    <div className="relative flex rounded-xl w-full h-fit justify-center shadow-2xl bg-baklavaBlack-200 shadow-baklavaBlack-200" onClick={() => setUserListItemDisplay(false)}>
      <div className={`w-[25rem] h-full   ${userListItemDisplay ? "absolute top-0 left-0 z-20" : "sticky hidden md:block"}`} onClick={e => {
        e.stopPropagation()
        console.log('qweqwe')
      }}>
        <UserListItem setUserListItemDisplay={setUserListItemDisplay} />
      </div>
      <div className="h-full  w-full max-w-[1280px] border-l-[0.1rem] border-gray-600 ">
        <ChatWindowHeader fullname={fullname} setUserListItemDisplay={setUserListItemDisplay} />
        <ChatWindowBody messages={chatMessagesState} />
        <div className="px-2 pb-2">
          <ChatWindowFooter sendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}

export default ChatBox
