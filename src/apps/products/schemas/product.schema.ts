import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Account } from 'src/apps/accounts/schemas/account.schema';
import { Brand } from 'src/apps/brands/schemas/brand.schema';
import { Category } from 'src/apps/categories/schemas/category.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    trim: true,
    required: true,
    minlength: 2,
    maxlength: 64,
  })
  name: string;

  @Prop({
    type: Number,
    required: true,
    min: 10000,
    max: 1000000000,
  })
  price: number;

  @Prop({
    default: '',
    trim: true,
    maxlength: 500,
  })
  description: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Account.name,
    required: true,
  })
  account: string | Account;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: string | Category;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Brand.name,
    required: true,
  })
  brand: string | Brand;

  @Prop([
    {
      type: String,
      required: true,
    },
  ])
  pictures: [string];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
