import { faker } from '@faker-js/faker'

import { IUser } from '@/types'

const getUsers = (n: number): IUser[] => {
  return [...Array(n)].map(() => ({
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    created_at: faker.date.past(),
    updated_at: null,
    deleted_at: null,
    isDeleted: false,
  }))
}

export const userList = getUsers(5)

export { getUsers }
