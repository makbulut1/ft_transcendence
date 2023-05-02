import { MessageCard } from '@/modules/chat/modules/components'

const dummyMessages = [
  {
    id: 1,
    message: 'Hello, this is the first message for user1',
    firstMessage: true,
    justify: 'end'
  },
  {
    id: 2,
    message: 'Hello, this is the second message for user1',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 3,
    message: 'Hello, this is the first message for guest',
    firstMessage: true,
    justify: 'start'
  },
  {
    id: 4,
    message: 'Hello, this is the second message for guest',
    firstMessage: false,
    justify: 'start'
  },
  {
    id: 5,
    message: 'Hello, this is the third message for user1',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 6,
    message: 'Hello, this is the fourth message for user1',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 7,
    message: 'Hello, this is the second message for user2',
    firstMessage: true,
    justify: 'end'
  },
  {
    id: 8,
    message: 'Hello, this is the third message for guest',
    firstMessage: false,
    justify: 'start'
  },
  {
    id: 9,
    message: 'Hello, this is the fifth message for user1',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 10,
    message: 'Hello, this is the third message for user2',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 11,
    message: 'Hello, this is the fourth message for user2',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 12,
    message: 'Hello, this is the sixth message for user1',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 13,
    message: 'Hello, this is the seventh message for user1',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 14,
    message: 'Hello, this is the fifth message for guest',
    firstMessage: true,
    justify: 'start'
  },
  {
    id: 15,
    message: 'Hello, this is the eighth message for user1',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 16,
    message: 'Hello, this is the fourth message for guest',
    firstMessage: true,
    justify: 'start'
  },
  {
    id: 17,
    message: 'Hello, this is the ninth message for user1',
    firstMessage: false,
    justify: 'end'
  },
  {
    id: 18,
    message: 'Hello, this is the sixth message for guest',
    firstMessage: false,
    justify: 'start'
  },
  {
    id: 19,
    message: 'Hello, this is the fifth message for user2',
    firstMessage: true,
    justify: 'end'
  },
  {
    id: 20,
    message: 'Hello, this is the seventh message for guest last',
    firstMessage: false,
    justify: 'start'
  }
]

interface MessageListProps {
  firstMessage: boolean
  justify: string
  message: string
  id: number
}


const MessageList = () => {

  const reverseMessage = dummyMessages.reverse()

  return (
    <div className="flex max-h-[50vh] min-h-[50vh] w-full flex-col-reverse gap-2 px-6 overflow-y-scroll rounded-md bg-baklavaBlack-200 py-2">
      {reverseMessage.map((item: MessageListProps, index, array) => (
        <MessageCard key={index} firstMessage={index > 0 && array[index - 1].justify === item.justify} justify={item.justify}>
          {item.message}
        </MessageCard>))}
    </div>
  )
}

export { MessageList }
