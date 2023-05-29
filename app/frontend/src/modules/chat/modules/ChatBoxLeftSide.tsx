import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ChangeEvent, useCallback, useState } from 'react'

import { UserList } from '@/modules/chat/lists'

interface SearchUserProps {
  setSearch: (value: string) => void
}

const SearchUser = ({ setSearch }: SearchUserProps) => {
  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    },
    [setSearch]
  )

  return (
    <div className="relative flex items-center">
      <MagnifyingGlassIcon className="absolute left-2 h-5 w-5 text-gray-500" />
      <input
        type="text"
        placeholder="Search"
        className="w-full rounded-md bg-[#1f2022] p-2 pl-8 text-white outline-8 outline-red-700"
        onChange={onInputChange}
      />
    </div>
  )
}

const ChatBoxLeftSideHeader = () => (
  <h1 className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text p-2 text-4xl font-extrabold text-transparent">
    Message
  </h1>
)

interface UserListItemProps {
  setUserListItemDisplay: (value: ((prevState: boolean | null) => boolean | null) | boolean | null) => void
}

const ChatBoxLeftSide = ({ setUserListItemDisplay }: UserListItemProps) => {
  const [search, setSearch] = useState<string>('')


  return (
    <div className="relative flex h-full flex-col gap-4 overflow-y-scroll rounded-md bg-[#151618] p-2">
      <ChatBoxLeftSideHeader />
      <SearchUser setSearch={setSearch} />
      <UserList search={search} />
      <div
        className="absolute right-3 top-5 z-30 block cursor-pointer text-white md:hidden"
        onClick={() => setUserListItemDisplay(false)}
      >
        Close{' '}
      </div>
    </div>
  )
}

export { ChatBoxLeftSide }
