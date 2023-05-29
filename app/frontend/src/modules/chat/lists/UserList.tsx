import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useEffect, useState } from 'react'

import { UserCard } from '@/modules/chat/modules/modules'
import { IUser } from '@/types'

interface IUserList {
  search?: string | undefined
}

const UserList = ({ search }: IUserList) => {
  const [userList, setUserList] = useState<IUser[]>([])
  const [parent] = useAutoAnimate(/* optional config */)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/users')
        const data = await response.json()
        const filteredData = search === undefined ? data : data.filter((item: IUser) => item.fullName.toLowerCase().includes(search.toLowerCase()))
        setUserList(filteredData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [search])

  return (
    <ul ref={parent} className="flex flex-col items-center">
      {userList.map((item, index) => (
        <li key={index}>
          <UserCard data={item} />
        </li>
      ))}
    </ul>
  )
}

export { UserList }
