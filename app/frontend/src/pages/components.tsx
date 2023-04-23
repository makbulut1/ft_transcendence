import { Header } from '@/layouts'
import { UserListItem } from '@/modules/chat/modules'
import { UserCard } from '@/modules/chat/modules/components'
import { Button } from '@/ui/Button'

const Page = () => {

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch('api/users', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(userList)
  //     })
  //     const data = await response.json();
  //     console.log(data);
  //   }
  //   fetchData().then(r => console.log(r))
  // })

  return (
    <div className="w-full h-full bg-neutral-200 flex flex-col items-center p-10 gap-10">
      <h1 className="font-black text-xl">Components</h1>
      <div className="w-full">
        <Header />
      </div>
      <div className="flex gap-4">
        <Button>Primary</Button>
        <Button intent="secondary">Secondary</Button>
        <Button intent="danger">Danger</Button>
      </div>
      <div className="w-[30rem]">
        <UserCard/>
      </div>
      <div className="w-[30rem]">
        <UserListItem/>
      </div>
    </div>
  )
}

export default Page