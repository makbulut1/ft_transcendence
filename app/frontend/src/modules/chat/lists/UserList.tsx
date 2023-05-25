import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useEffect, useState } from 'react'

import { UserCard } from '@/modules/chat/modules/components'
import { IUser } from '@/types'

interface IUserList {
  search?: string | undefined
}

const UserList = ({ search }: IUserList) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [userList, setUserList] = useState<IUser[]>([])
  const [parent] = useAutoAnimate(/* optional config */)

  const onCardClick = (index: number) => {
    setSelectedCard(index)
  }

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
        <li key={index} onClick={() => onCardClick(index)}>
          <UserCard data={item} selected={selectedCard === index} />
        </li>
      ))}
    </ul>
  )
}

export { UserList }
