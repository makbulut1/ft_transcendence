import { faker } from '@faker-js/faker'
import Image from 'next/image'
import React from 'react'

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
        <span className="ml-5 font-medium text-gray-500">{props.time}</span>
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
      } w-fit ${props.justify === 'end' ? 'bg-[#429FFE]' : 'bg-[#28292D]'} p-2 px-4 text-white`}
    >
      {props.children}
    </div>
  </div>
)

const ProfilePhoto = (props: { show: boolean | undefined; src: string; alt: string, size?: number}) => (
  <div className={` ${props.show ? '' : 'invisible'}`}>
    <Image src={props.src} alt={props.alt} width={props.size || 50} height={props.size || 50}
           className="rounded-full" />
  </div>
)

interface IMessageCard {
  children: React.ReactNode
  firstMessage?: boolean
  justify?: 'start' | 'end'
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

export { MessageCard, ProfilePhoto }
