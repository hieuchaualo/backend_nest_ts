import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/apps/utils';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({
    trim: true,
    minlength: 2,
    maxlength: 32,
  })
  name: string;

  @Prop({ trim: true })
  avatar: string;

  @Prop({
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
    minlength: 8,
    maxlength: 64,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 8,
    maxlength: 64,
  })
  password: string;

  @Prop({ default: [Role.User] })
  roles: Role[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
