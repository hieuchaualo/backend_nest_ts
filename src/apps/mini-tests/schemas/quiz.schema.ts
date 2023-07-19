import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {
  @Prop({
    trim: true,
    required: true,
    unique: true,
  })
  question: string;

  @Prop([
    {
      type: String,
      trim: true,
      required: true
    },
  ])
  answers: [string];

  @Prop([
    {
      type: String,
      trim: true,
    },
  ])
  options: [string];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
