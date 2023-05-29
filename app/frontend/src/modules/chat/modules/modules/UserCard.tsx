import { faker } from '@faker-js/faker'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { IUser } from '@/types'
import { ProfilePhoto } from '@/ui/ProfilePhoto'

interface PhotoComponentProps {
  avatar: string | undefined
}

const PhotoComponent = ({ avatar }: PhotoComponentProps) => {
  const [randomNumber, setRandomNumber] = useState(0)

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 3))
  }, [])

  const colors = ['bg-red-500', 'bg-blue-100/90', 'bg-[#6DCC96]']
  return (
    <div className="min-w-fit relative">
      <ProfilePhoto show={true} src={avatar || ""} alt={faker.name.fullName()} size={60} />
      <div className={`absolute bottom-0 right-0 w-5 h-5 ${colors[randomNumber]} rounded-full border-[4px] border-[#151618]`} />
    </div>
  )
}

interface NameAndLastMessageProps {
  name: string | undefined
}

const NameAndLastMessage = ({ name }: NameAndLastMessageProps) => (
  <div className="flex w-5/6 flex-col">
    <span className="font-bold">{name ?? `Eren Akbulut`} </span>
    <span className="truncate text-gray-500">Last Message Last Message Last Message </span>
  </div>
)

const Notification = () => {
  const [randomNumber, setRandomNumber] = useState(1)

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 3))
  }, [])

  return (<>
  {randomNumber === 0 && <div />}
  {randomNumber === 1 && <div className="relative h-10"><span className='absolute text-gray-500 right-0 top-2'>12:00</span></div>}
  {randomNumber === 2 && <div className="relative h-10"><span
    className='absolute right-0 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs top-2'>2</span></div>}
  </>);
}

interface IUserCard {
  selected?: boolean | null,
  data?: IUser
}

const UserCard = ({ selected, data }: IUserCard) => {
  return (
    <div
      className={`flex w-full items-center justify-between gap-4 rounded-2xl ${!selected ? "bg-[#151618]" : "bg-[#1F2022]"} p-4 text-white duration-200 hover:bg-[#1F2022] 
        active:brightness-110 cursor-pointer`}
    >
      <div className="flex w-3/4 items-center gap-6">
        <PhotoComponent avatar={data?.avatar} />
        <NameAndLastMessage name={data?.fullName}/>
      </div>
      <Notification />
    </div>
  )
}

export { UserCard }
