import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { Brand, BrandDocument } from './schemas/brand.schema';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    let brandExisted = await this.brandModel
      .findOne({
        name: createBrandDto.name.trim(),
      })
      .exec();
    // If brand not exist, create new one
    brandExisted =
      brandExisted ?? (await this.brandModel.create(createBrandDto));
    this.categoriesService.findByNameAndAddToSetBrands(
      createBrandDto.category,
      brandExisted._id,
    );
    return brandExisted;
  }

  async findAll(): Promise<Brand[]> {
    const brands = await this.brandModel.find().exec();
    return brands;
  }

  async findById(id: string): Promise<Brand> {
    const brand = await this.brandModel.findById(id).exec();
    return brand;
  }

  async findByIdAndUpdate(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel
      .findByIdAndUpdate(id, updateBrandDto)
      .exec();
    return brand;
  }

  async delete(id: string) {
    const deletedBrand = await this.brandModel.findByIdAndDelete(id).exec();
    this.categoriesService.findAllAndPullBrands(id);
    return deletedBrand;
  }
}
