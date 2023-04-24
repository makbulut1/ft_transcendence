import React from 'react'

interface IMessageCard {
  children: React.ReactNode
  first?: boolean
  justify?: 'start' | 'end'
}

const NameAndTime = (props: {
  first: boolean | undefined
  justify: 'start' | 'end' | undefined
  name: string
  time: string
}) => (
  <>
    {props.first && (
      <div className={`${props.justify === 'start' ? '' : 'ml-auto'} font-bold text-white`}>
        <span>{props.name}</span>
        <span className='ml-5 font-medium text-gray-500'>{props.time}</span>
      </div>
    )}
  </>
)

const Content = (props: {
  justify: 'start' | 'end' | undefined
  first: boolean | undefined
  children: React.ReactNode
}) => (
  <div className={`flex w-full ${props.justify === 'start' ? '' : 'justify-end'}`}>
    <div
      className={`${
        props.first
          ? props.justify === 'end'
            ? 'rounded-l-3xl rounded-br-3xl'
            : 'rounded-r-3xl rounded-bl-3xl'
          : 'rounded-3xl'
      } w-fit ${props.justify === 'end' ? 'bg-[#429FFE]' : 'bg-[#28292D]'} p-2 px-4 font-semibold text-white`}
    >
      {props.children}
    </div>
  </div>
)

const MessageCard = ({ children, first = false, justify }: IMessageCard) => {
  const name = 'Eren'
  const time = '4m'

  return (
    <div className="flex flex-col">
      <NameAndTime first={first} justify={justify} name={name} time={time} />
      <Content justify={justify} first={first}>{children}</Content>
    </div>
  )
}

export { MessageCard }
