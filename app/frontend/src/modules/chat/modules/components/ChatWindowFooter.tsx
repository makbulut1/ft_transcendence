import { faker } from '@faker-js/faker'
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { SubmitHandler, useForm } from 'react-hook-form'

import { ProfilePhoto } from '@/ui/ProfilePhoto'

interface Inputs {
  message: string
}

const ChatWindowFooter = () => {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex w-full ">
        <input
          type="textarea"
          placeholder={'Type your message...'}
          className="w-full rounded-xl bg-baklavaBlack-100 p-3 px-10 text-white outline-none pr-10 overflow-x-auto"
          {...register('message', { required: true })}
        />
        <button className="absolute hover:bg-baklavaBlack-50 active:brightness-125 duration-200 right-1 top-2 text-white rounded-full p-1" type="submit">
          <PaperAirplaneIcon className="h-6 w-6 -rotate-45" />
        </button>
        <div className="absolute left-1 top-2.5"><ProfilePhoto size={30} show={true} src={faker.image.avatar()} alt={faker.name.firstName()} /></div>
      </div>
    </form>
  )
}

export { ChatWindowFooter }
