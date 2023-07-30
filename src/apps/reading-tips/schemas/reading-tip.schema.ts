import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Account } from '../../accounts/schemas/account.schema';

export type ReadingTipDocument = ReadingTip & Document;

@Schema({ timestamps: true })
export class ReadingTip {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
  })
  content: string;

  @Prop({
    type: String,
  })
  thumbnail: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Account.name,
    required: true,
  })
  creator: string | Account;
}

export const ReadingTipSchema = SchemaFactory.createForClass(ReadingTip);
