import Image from 'next/image'

import { IUser } from '@/types'
import { fDate } from '@/utils/formatDate'

interface IGameCardProps {
  firstUser: IUser
  secondUser: IUser
  score: number[]
  time: Date
}

const GameCardProfile = (props: { user: IUser }) => {
  return (
    <div className="flex w-fit flex-col gap-2 items-center">
      <Image
        className="rounded-full shadow-md shadow-violet-800"
        src={props.user.avatar}
        alt="avatar"
        width={50}
        height={50}
      />
      <span>{props.user.fullName}</span>
    </div>
  )
};

const GameCard = ({ firstUser, secondUser, score, time }: IGameCardProps) => {
  return (
    <div className="inline-block rounded-2xl bg-gradient-to-r from-[#ad5389] to-[#3c1053] p-2 px-4 text-white duration-200 hover:brightness-125">
      <div className="flex justify-between gap-2">
        {/*img firstuser with button*/}
        <GameCardProfile user={firstUser} />

        {/*game score - time*/}
        <div className="flex flex-col items-center justify-center ">
          <span>{fDate(time)}</span>
          <span>
            {score[0]} - {score[1]}
          </span>
        </div>

        {/*img seconduser with button */}
        <GameCardProfile user={secondUser} />
      </div>
    </div>
  )
}

export { GameCard }
