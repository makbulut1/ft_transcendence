import { useEffect, useState } from 'react'

import { ChatMessage, chatMessages } from '@/_Mock/chat/dummyChat'

import { ChatBoxBody, ChatBoxLeftSide } from './modules'

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
      setUserListItemDisplay(false)
    }

    // Initial check
    if (window.innerWidth > 1024) {
      handleResize()
    }

    // Event listener for window resize
    window.addEventListener('resize', handleResize)

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }
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
    const reversedItems = [...chatMessages]
    setChatMessagesState(reversedItems.reverse())
  }

  //Variables
  const fullname = 'Eren Akbulut'

  return (
    <div
      className="relative flex h-fit w-full justify-center rounded-xl bg-baklavaBlack-200 shadow-2xl shadow-baklavaBlack-200"
      onClick={() => setUserListItemDisplay(false)}
    >
      <div
        className={`h-full w-[25rem]   ${
          userListItemDisplay ? 'absolute left-0 top-0 z-20' : 'sticky hidden md:block'
        }`}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <ChatBoxLeftSide setUserListItemDisplay={setUserListItemDisplay} />
      </div>
      <ChatBoxBody
        fullname={fullname}
        userListItemDisplay={setUserListItemDisplay}
        messages={chatMessagesState}
        sendMessage={handleSendMessage}
      />
    </div>
  )
}

export default ChatBox
