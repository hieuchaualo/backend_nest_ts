import { Role } from "src/apps/utils";

export interface IAccount {
  _id: string;
  name: string;
  email: string;
  roles: Role[];
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
}
