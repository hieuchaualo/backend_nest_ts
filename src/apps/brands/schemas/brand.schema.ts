import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema()
export class Brand {
  @Prop({
    trim: true,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 32,
  })
  readonly name: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
