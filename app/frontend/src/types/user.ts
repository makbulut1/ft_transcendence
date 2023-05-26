export interface IUser {
  id: string;
  fullName: string;
  email: string;
  login?: string;
  avatar: string;
  createdAt: Date;
  updatedAt: null | Date;
  deletedAt: null | Date;
  isDeleted: boolean;
}