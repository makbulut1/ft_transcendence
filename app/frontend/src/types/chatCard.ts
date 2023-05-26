export interface IChatCard {
  id: string;
  user_id: string;
  group_id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: boolean;
}