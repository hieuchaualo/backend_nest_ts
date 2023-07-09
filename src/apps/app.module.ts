import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CoreModule } from '../core/core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './accounts/accounts.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'pictures'),
      renderPath: 'static'
    }),
    CoreModule,
    AccountsModule,
    BrandsModule,
    CategoriesModule,
    ProductsModule,
  ],
})
export class AppModule {}
