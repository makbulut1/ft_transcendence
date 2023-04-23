import { useEffect, useState } from 'react'

import UserCard from '@/modules/chat/modules/UserCard'
import { IUser } from '@/types'

interface UserCardListProps {
  search: string
}

const UserCardList = ({ search }: UserCardListProps) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [userList, setUserList] = useState<IUser[]>([])

  const onCardClick = (index: number) => {
    setSelectedCard(index)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/users')
        const data = await response.json()
        const filteredData = data.filter((item: IUser) => item.name.toLowerCase().includes(search.toLowerCase()))
        setUserList(filteredData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [search])

  return (
    <div className="flex flex-col items-center">
      {userList.map((item, index) => (
        <div key={index} onClick={() => onCardClick(index)}>
          <UserCard data={item} selected={selectedCard === index} />
        </div>
      ))}
    </div>
  )
}

export default UserCardList
