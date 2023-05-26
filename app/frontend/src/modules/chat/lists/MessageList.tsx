import { faker } from '@faker-js/faker'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useEffect } from 'react'

import { ChatMessage } from '@/_Mock/chat/dummyChat'
import { MessageCard } from '@/modules/chat/modules/components'

/**
 * TODO Sonradan kullanilacak
 * @param date1
 * @param date2
 */
const diffDate = (date1: Date, date2: Date) => {
  return date1.getTime() - date2.getTime()
}
interface MessageListProps {
  messages: ChatMessage[],
}

/**
 * Data zaten reverse olarak gelecek o yuzden bu tarz islemlere gerek yok
 * TODO: reverseArray'i sil
 * @constructor
 */

const MessageList = ({ messages }: MessageListProps) => {
  const [parent] = useAutoAnimate(/* optional config */)

  useEffect(() => {}, [])

  const userMe = {
    id: 1,
    name: 'User1',
    avatar: faker.image.avatar(),
    status: 'online',
  }
  const userGuest = {
    id: 2,
    name: 'Guest',
    avatar: faker.image.avatar(),
    status: 'online',
  }

  return (
    <div className="h-[78vh] w-full">
      <ul
        ref={parent}
        className='flex h-full w-full flex-col-reverse gap-2 overflow-y-scroll rounded-md bg-baklavaBlack-200 px-6 py-2 pt-14'
      >
        {messages &&
          messages.length > 0 &&
          messages.map((item: ChatMessage, index, array) => (
            <li key={item.id}>
              <MessageCard
                firstMessage={
                  index === array.length - 1 || (index < array.length - 1 && array[index + 1].senderId !== item.senderId)
                }
                position={item.senderId === userMe.id ? 'end' : 'start'}
              >
                {item.message}
              </MessageCard>
            </li>
          ))}
      </ul>
    </div>
  )
}

export { MessageList }

//&& diffDate(array[index - 1].timestamp, item.timestamp) > 30000
