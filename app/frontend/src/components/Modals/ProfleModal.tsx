import { ArrowUturnLeftIcon, CameraIcon, CheckCircleIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react'
import { useWizard, Wizard } from 'react-use-wizard'

import { gameCard } from '@/_Mock'
import { GameCard } from '@/modules/game'
import { useStoreUser } from '@/store'
import { IUser } from '@/types'
import { Button } from '@/ui/Button'

const PhotoUpload = () => {
  const [file, setFile] = useState<File | undefined>(undefined)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files && files[0]) {
      setFile(files[0])
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log('file', file)

    if (!file) {
      console.log('No file selected')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    //TODO: send to server
    //Submit islemi kontrol edilecek, button eklenebilir yada direkt dosya secilince yukleme baslayabilir

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="photoUpload"
        className="absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-full opacity-0 duration-200 hover:bg-baklavaBlack-50 hover:opacity-60"
      >
        <CameraIcon className="absolute h-20 w-20 text-gray-400 duration-200 " />
      </label>
      <input id="photoUpload" type="file" className="hidden" onChange={handleFileChange} />
    </form>
  )
}

function UserNick(props: { userRender: { login?: string | undefined } | undefined }) {
    const [userNick, setUserNick] = useState<string | undefined>(props.userRender?.login)
    const [isEdit, setIsEdit] = useState(false)

    const handleChangeNick = (): void => {
      //TODO: send to server
      setIsEdit(!isEdit)
      console.log(userNick)
    };

    return (
      <div className="flex gap-2">
        {isEdit ? (
          <input 
          onChange={(e) => setUserNick(e.target.value)}
          type="text" defaultValue={props.userRender?.login} className="text-black"></input>
        ) : (
          <span>{props.userRender?.login}</span>
        )}
        {!isEdit ? (
          <PencilSquareIcon className="h-6 w-6 text-white hover:brightness-125 " onClick={() => setIsEdit(!isEdit)} />
        ) : (
          <CheckCircleIcon onClick={handleChangeNick} className="h-8 w-8 text-white" />
        )}
      </div>
    )
}

const ProfileDetail = (props: {
  userRender:
    | {
        id?: number | string | undefined
        fullName?: string | undefined
        email?: string | undefined
        login?: string | undefined
        avatar?: string | undefined
      }
    | undefined
  onClick: () => void
}) => {
  const { nextStep } = useWizard()

  return (
    <div className="flex flex-col items-center gap-8 text-white">
      {/*Photo*/}
      <div className="relative overflow-hidden rounded-full border-4 border-[#422558]">
        <Image
          className=" h-48 w-48 rounded-full  object-cover object-center p-2"
          src={props.userRender?.avatar ?? ''}
          alt={props.userRender?.avatar ?? ''}
          width={300}
          height={300}
        />
        <PhotoUpload />
      </div>

      {/*Name*/}
      <div className="text-xl font-bold">{props.userRender?.fullName}</div>

      {/*Nick*/}
      <UserNick userRender={props.userRender}></UserNick>

      {/*Game button*/}
      <div className="flex gap-4">
        <Button intent="primary" onClick={props.onClick}>
          Challenge
        </Button>
        <Button intent="secondary" onClick={props.onClick}>
          Chat
        </Button>
      </div>

      {/*Game history button*/}
      <Button onClick={() => nextStep()}>Game history</Button>
    </div>
  )
}

const GameHistory = () => {
  const { previousStep } = useWizard()

  const mapGames = () => {
    return [...Array(20)].map((_, index) => (
      <GameCard
        key={index}
        firstUser={gameCard.firstUser}
        secondUser={gameCard.secondUser}
        score={gameCard.score}
        time={gameCard.time}
      />
    ))
  }

  return (
    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-scroll">
      <div className="flex" onClick={() => previousStep()}>
        <ArrowUturnLeftIcon className="h-8 w-8 cursor-pointer rounded-full p-1 text-white duration-200 hover:bg-violet-500 active:brightness-75" />
        <span className="w-full text-center text-xl font-bold text-white">Game History</span>
      </div>
      <div className="flex flex-col items-center gap-4 text-white">
        {/*  Game History*/}
        <div>Games...</div>
        {mapGames()}
      </div>
    </div>
  )
}

const ProfileModal = ({ userData }: { userData?: IUser }) => {
  const { user } = useStoreUser()

  const userRender = userData ? userData : user

  const handleChallange = () => {
    console.log('Challenge')
  }

  return (
    <Wizard>
      <ProfileDetail userRender={userRender} onClick={handleChallange} />
      <GameHistory />
    </Wizard>
  )
}

export { ProfileModal }
