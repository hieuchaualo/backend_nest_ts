import { Role } from "src/apps/utils";

export interface IAccount {
  _id: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
  password?: string;
}
