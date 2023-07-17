import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Account } from 'src/apps/accounts/schemas/account.schema';
import { Quiz } from './quiz.schema';

export type ReadingTestDocument = ReadingTest & Document;

@Schema({ timestamps: true })
export class ReadingTest {
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

  @Prop([{
    type: Quiz,
    required: true,
  }])
  quizzes: [Quiz] | [string];

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

export const ReadingTestSchema = SchemaFactory.createForClass(ReadingTest);
