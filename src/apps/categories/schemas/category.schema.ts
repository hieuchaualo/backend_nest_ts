import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Brand } from '../../brands/schemas/brand.schema';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({
    trim: true,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 32,
  })
  readonly name: string;

  @Prop([
    {
      type: SchemaTypes.ObjectId,
      ref: Brand.name,
      required: true,
    },
  ])
  readonly brands: [string] | [Brand];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
