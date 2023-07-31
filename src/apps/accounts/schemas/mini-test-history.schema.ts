import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MiniTest } from '../../mini-tests/schemas';

export type MiniTestHistoryDocument = MiniTestHistory & Document;

@Schema({ timestamps: true })
export class MiniTestHistory {
  @Prop({
    type: SchemaTypes.ObjectId,
    // ref: MiniTest.name,
    ref: "minitests",
  })
  miniTest: string | MiniTest;

  @Prop({
    default: 0,
  })
  timeLimit: number;

  @Prop({
    default: 0,
  })
  timeTaken: number;

  @Prop({
    default: 0,
  })
  totalQuestions: number;

  @Prop({
    default: 0,
  })
  totalCorrectAnswers: number;
}

export const MiniTestHistorySchema = SchemaFactory.createForClass(MiniTestHistory);
