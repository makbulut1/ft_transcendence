import { Header } from '@/layouts'
import { UserListItem } from '@/modules/chat/modules'
import { MessageCard, UserCard } from '@/modules/chat/modules/components'
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
    <div className="flex h-full w-full flex-col items-center gap-10 bg-neutral-200 p-10">
      <h1 className="text-xl font-black">Components</h1>
      <div className="flex w-[50rem] flex-col gap-4 bg-baklavaBlack-1 p-4 rounded-md">
        <MessageCard first={true} justify="end">
          Hello this is first message for user
        </MessageCard>
        <MessageCard first={false} justify="end">
          Hello this is second message for user
        </MessageCard>
        <MessageCard first={true} justify="start">
          Hello this is first message for guest
        </MessageCard>
        <MessageCard first={false} justify="start">
          Hello this is second message for guest
        </MessageCard>
      </div>
      <div className="w-full">
        <Header />
      </div>
      <div className="flex gap-4">
        <Button>Primary</Button>
        <Button intent="secondary">Secondary</Button>
        <Button intent="danger">Danger</Button>
      </div>
      <div className="w-[30rem]">
        <UserCard />
      </div>
      <div className="w-[30rem]">
        <UserListItem />
      </div>

    </div>
  )
}

export default Page
