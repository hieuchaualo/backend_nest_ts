import { IBrand } from '../../brands/interfaces/brand.interface';

export interface ICategory {
  name: string;
  brands: [string] | [IBrand];
}
