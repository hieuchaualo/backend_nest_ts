import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CoreModule } from '../core/core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './accounts/accounts.module';
import { MiniTestsModule } from './mini-tests/mini-tests.module';
import { ReadingTipsModule } from './reading-tips/reading-tips.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'pictures'),
      renderPath: 'static'
    }),
    CoreModule,
    AccountsModule,
    MiniTestsModule,
    ReadingTipsModule,
  ],
})
export class AppModule { }
