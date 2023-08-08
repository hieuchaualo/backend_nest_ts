import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MiniTest, MiniTestSchema } from './schemas/mini-test.schema';
import { MiniTestsController } from './mini-tests.controller';
import { MiniTestsService } from './mini-tests.service';
import { Account, AccountSchema } from '../accounts/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MiniTest.name, schema: MiniTestSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [MiniTestsController],
  providers: [MiniTestsService],
})
export class MiniTestsModule { }
