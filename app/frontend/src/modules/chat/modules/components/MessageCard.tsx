import { faker } from '@faker-js/faker'
import React from 'react'

import { ProfilePhoto } from '@/ui/ProfilePhoto'

const NameAndTime = (props: {
  first: boolean | undefined
  justify?: string
  name: string
  time: string
}) => (
  <>
    {props.first && (
      <div className={`${props.justify === 'start' ? '' : 'ml-auto'} font-bold text-white`}>
        <span>{props.name}</span>
        <span className="ml-5 font-medium text-gray-500">{props.time}</span>
      </div>
    )}
  </>
)

const Content = (props: {
  justify?: string
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
      } w-fit ${props.justify === 'end' ? 'bg-[#429FFE]' : 'bg-[#28292D]'} p-2 px-4 text-white`}
    >
      {props.children}
    </div>
  </div>
)

interface IMessageCard {
  children: React.ReactNode
  firstMessage?: boolean
  justify?: string
}

const MessageCard = ({ children, firstMessage = false, justify }: IMessageCard) => {
  const name = 'Eren'
  const time = '4m'
  const avatar = faker.image.avatar()
  const alt = faker.name.firstName()

  return (
    <div className={`flex w-full gap-4 ${justify === 'end' ? 'flex-row-reverse' : ''}`}>
      <ProfilePhoto show={firstMessage} src={avatar} alt={alt} />
      <div className="flex w-full flex-col gap-3">
        <NameAndTime first={firstMessage} justify={justify} name={name} time={time} />
        <Content justify={justify} first={firstMessage}>
          {children}
        </Content>
      </div>
    </div>
  )
}

export { MessageCard }
