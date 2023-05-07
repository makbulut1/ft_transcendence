import { faker } from '@faker-js/faker'
import React from 'react'

import { ProfilePhoto } from '@/ui/ProfilePhoto'

const NameAndTime = (props: {
  first: boolean | undefined
  position?: string
  name: string
  time: string
}) => (
  <>
    {props.first && (
      <div className={`${props.position === 'start' ? '' : 'ml-auto'} font-bold text-white`}>
        <span>{props.name}</span>
        <span className="ml-5 font-medium text-gray-500">{props.time}</span>
      </div>
    )}
  </>
)

const Content = (props: {
  position?: string
  first: boolean | undefined
  children: React.ReactNode
}) => (
  <div className={`flex w-full ${props.position === 'start' ? '' : 'justify-end'}`}>
    <div
      className={`${
        props.first
          ? props.position === 'end'
            ? 'rounded-l-3xl rounded-br-3xl'
            : 'rounded-r-3xl rounded-bl-3xl'
          : 'rounded-3xl'
      } w-fit ${props.position === 'end' ? 'bg-[#429FFE]' : 'bg-[#28292D]'} p-2 px-4 text-white`}
    >
      {props.children}
    </div>
  </div>
)

interface IMessageCard {
  children: React.ReactNode
  firstMessage?: boolean
  position?: "start" | "end"
}

const MessageCard = ({ children, firstMessage = false, position }: IMessageCard) => {

  const name = 'Eren'
  const time = '4m'
  const avatar = faker.image.avatar()
  const alt = faker.name.firstName()

  return (
    <div className={`flex w-full gap-4 ${position === 'end' ? 'flex-row-reverse' : ''}`}>
      <ProfilePhoto show={firstMessage} src={avatar} alt={alt} />
      <div className="flex w-full flex-col gap-3">
        <NameAndTime first={firstMessage} position={position} name={name} time={time} />
        <Content position={position} first={firstMessage}>
          {children}
        </Content>
      </div>
    </div>
  )
}

export { MessageCard }
