import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    CategoriesModule,
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
