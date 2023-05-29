import { faker } from '@faker-js/faker'

import { IUser } from '@/types'

interface IGameCardProps {
  firstUser: IUser;
  secondUser: IUser;
  score: number[];
  time: Date;
}

const dFirstUser: IUser = {
  id: faker.datatype.uuid(),
  fullName: 'Eren Akbulut',
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  createdAt: new Date(),
  updatedAt: null,
  deletedAt: null,
  isDeleted: false,
}

const dSecondUser: IUser = {
  id: faker.datatype.uuid(),
  fullName: 'Esra Budak',
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  createdAt: new Date(),
  updatedAt: null,
  deletedAt: null,
  isDeleted: false,
}

const dScore: number[] = [2, 5]

const dTime: Date = new Date()

export const gameCard: IGameCardProps = {
  firstUser: dFirstUser,
  secondUser: dSecondUser,
  score: dScore,
  time: dTime,
}