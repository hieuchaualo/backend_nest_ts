import { Role } from "src/apps/utils";
import { IMiniTestHistory } from "./mini-test-history.interface"

export interface IAccount {
  _id?: string;
  name?: string;
  email?: string;
  roles?: Role[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  miniTestHistory?: string[] | IMiniTestHistory[];
}
