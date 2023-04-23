export interface IChatCard {
  id: string;
  user_id: string;
  group_id: string;
  message: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  isDeleted: boolean;
}