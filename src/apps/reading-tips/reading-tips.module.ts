import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadingTip, ReadingTipSchema } from './schemas';
import { ReadingTipsController } from './reading-tips.controller';
import { ReadingTipsService } from './reading-tips.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReadingTip.name, schema: ReadingTipSchema }]),
  ],
  controllers: [ReadingTipsController],
  providers: [ReadingTipsService],
})

export class ReadingTipsModule {}
