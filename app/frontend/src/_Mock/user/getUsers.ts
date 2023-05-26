import { faker } from '@faker-js/faker'

import { IUser } from '@/types'

const getUsers = (n: number): IUser[] => {
  return [...Array(n)].map(() => ({
    id: faker.datatype.uuid(),
    fullName: faker.name.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    createdAt: faker.date.past(),
    updatedAt: null,
    deletedAt: null,
    isDeleted: false,
  }))
}

export const userList = getUsers(5)

export { getUsers }
