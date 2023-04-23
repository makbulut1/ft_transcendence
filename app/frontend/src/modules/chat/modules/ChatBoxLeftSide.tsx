import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ChangeEvent, useCallback, useState } from 'react'

import UserCardList from '@/modules/chat/lists/UserCardList'

interface SearchUserProps {
  setSearch: (value: string) => void
}

const SearchUser = ({ setSearch }: SearchUserProps) => {
  const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, [setSearch])

  return <div className="flex items-center relative">
    <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-2" />
    <input type="text" placeholder="Search" className="w-full rounded-md bg-[#1f2022] outline-8 outline-red-700 text-white p-2 pl-8"
           onChange={onInputChange} />
  </div>
}

const ChatBoxLeftSide = () => {
  const [search, setSearch] = useState<string>('')

  console.log(search)

  return (
    <div className="flex flex-col gap-4 rounded-md bg-[#151618] p-2">
      <h1 className="text-gray-300 py-3 px-2 text-xl">Messages</h1>
      <SearchUser setSearch={setSearch} />
      <UserCardList search={search} />
    </div>
  )
}

export default ChatBoxLeftSide