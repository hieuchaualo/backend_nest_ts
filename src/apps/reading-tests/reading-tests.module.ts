import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadingTest, ReadingTestSchema } from './schemas/reading-test.schema';
import { ReadingTestsController } from './reading-tests.controller';
import { ReadingTestsService } from './reading-tests.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReadingTest.name, schema: ReadingTestSchema }]),
  ],
  controllers: [ReadingTestsController],
  providers: [ReadingTestsService],
})
export class ReadingTestsModule {}
