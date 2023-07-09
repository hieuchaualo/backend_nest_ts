import { Account } from 'src/apps/accounts/schemas/account.schema';
import { Brand } from 'src/apps/brands/schemas/brand.schema';
import { Category } from 'src/apps/categories/schemas/category.schema';

export interface IProduct {
  name: string;
  price: number;
  description: string;
  account: string | Account;
  category: string | Category;
  brand: string | Brand;
  pictures: [string];
}

export default IProduct;
