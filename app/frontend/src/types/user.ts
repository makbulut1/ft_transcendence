export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: Date;
  updated_at: null | Date;
  deleted_at: null | Date;
  isDeleted: boolean;
}