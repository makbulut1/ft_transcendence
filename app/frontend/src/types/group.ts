export interface IGroup {
  id: string;
  users_id: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: boolean;
}