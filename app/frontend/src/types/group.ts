export interface IGroup {
  id: string;
  users_id: string[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  isDeleted: boolean;
}