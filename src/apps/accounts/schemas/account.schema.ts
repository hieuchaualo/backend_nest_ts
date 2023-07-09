import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({
    trim: true,
    minlength: 2,
    maxlength: 32,
  })
  readonly name: string;

  @Prop({
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
    minlength: 8,
    maxlength: 64,
  })
  readonly email: string;

  @Prop({
    required: true,
    minlength: 8,
    maxlength: 64,
  })
  readonly password: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
