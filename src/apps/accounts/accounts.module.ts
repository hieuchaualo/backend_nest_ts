import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/account.schema';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../utils';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, JwtStrategy, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
  exports: [AccountsService],
})
export class AccountsModule {}
