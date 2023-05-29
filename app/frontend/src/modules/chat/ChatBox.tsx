import { useEffect, useState } from 'react'

import { ChatBoxBody, ChatBoxLeftSide } from './modules'

const ChatBox = () => {
  const [userListItemDisplay, setUserListItemDisplay] = useState<boolean | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setUserListItemDisplay(false)
    }
    if (window.innerWidth > 1024) {
      handleResize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const fullname = 'Eren Akbulut'

  return (
    <div
      className="relative flex h-fit w-full justify-center rounded-xl bg-baklavaBlack-200 shadow-2xl shadow-baklavaBlack-200"
      onClick={() => setUserListItemDisplay(false)}
    >
      <div
        className={`h-full w-[25rem]   ${
          userListItemDisplay ? 'absolute left-0 top-0 z-20 shadow-3xl shadow-black' : 'sticky hidden md:block'
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
      />
    </div>
  )
}

export default ChatBox
