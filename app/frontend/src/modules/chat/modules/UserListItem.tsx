import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ChangeEvent, useCallback, useState } from 'react'

import { UserList } from '@/modules/chat/lists'


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

const UserListItemHeader = () => (
  <h1
    className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text p-2 text-4xl font-extrabold text-transparent">
    Message
  </h1>
)

interface UserListItemProps {
  setUserListItemDisplay: (value: (((prevState: (boolean | null)) => (boolean | null)) | boolean | null)) => void
}

const UserListItem = ({setUserListItemDisplay}: UserListItemProps) => {
  const [search, setSearch] = useState<string>('')


  return (
    <div className="relative flex flex-col h-full overflow-y-scroll gap-4 rounded-md bg-[#151618] p-2">
      <UserListItemHeader />
      <SearchUser setSearch={setSearch} />
      <UserList search={search} />
      <div className="block md:hidden absolute right-3 cursor-pointer top-5 z-30 text-white" onClick={() => setUserListItemDisplay(false)} >Close </div>
    </div>
  )
}

export { UserListItem }