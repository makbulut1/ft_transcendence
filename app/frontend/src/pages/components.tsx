import Cookies from 'js-cookie'

import { Header } from '@/layouts'
import { ChatWindow, UserListItem } from '@/modules/chat/modules'
import { ChatWindowFooter, ChatWindowHeader, MessageCard, UserCard } from '@/modules/chat/modules/components'
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

  const sessionToken = Cookies.get('sessionToken');
  console.log(sessionToken)

  return (
    <div className="flex h-full w-full flex-col items-center bg-baklavaBlack-50 gap-10 p-10">
      <h1 className="text-xl text-white">Components</h1>
      <div className="w-[50rem]"><ChatWindow /></div>
      <div className="w-[50rem]"><ChatWindowHeader/></div>
      <div className="w-[50rem] p-10 bg-baklavaBlack-200">
        <ChatWindowFooter />
      </div>
      <div className="flex w-[50rem] flex-col gap-2 bg-baklavaBlack-200 p-4 rounded-md">
        <MessageCard firstMessage={true} justify="end">
          Hello this is first message for user
        </MessageCard>
        <MessageCard firstMessage={false} justify="end">
          Hello this is second message for user
        </MessageCard>
        <MessageCard firstMessage={true} justify="start">
          Hello this is first message for guest
        </MessageCard>
        <MessageCard firstMessage={false} justify="start">
          Hello this is second message for guest
        </MessageCard>
      </div>
      <div className="w-full">
        <Header />
      </div>
      <div className="flex gap-4">
        <Button >Primary</Button>
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
