import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly catagoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = await this.catagoryModel.create(createCategoryDto);
    return createdCategory;
  }

  async getCategoriesAndBrands(): Promise<Category[]> {
    const catagories = this.catagoryModel
      .find()
      .where({ brands: { $exists: true, $not: { $size: 0 } } })
      .populate('brands', 'name')
      .exec();
    return catagories;
  }

  async getCategoryAndBrands(id: string): Promise<Category> {
    const catagory = this.catagoryModel
      .findById(id)
      .populate('brands', 'name')
      .exec();
    return catagory;
  }

  async findByIdAndUpdate(id: string, updateCategoryDto: UpdateCategoryDto) {
    const catagory = this.catagoryModel
      .findByIdAndUpdate(id, updateCategoryDto)
      .exec();
    return catagory;
  }

  async findByNameAndAddToSetBrands(catagoryName: string, brandId: string) {
    const catagory = this.catagoryModel.findOneAndUpdate(
      { name: catagoryName },
      { $addToSet: { brands: brandId } },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
    return catagory;
  }

  async findByIdAndPullBrands(catagoryId: string, brandId: string) {
    const catagory = this.catagoryModel.findByIdAndUpdate(
      catagoryId,
      { $pull: { brands: brandId } },
      {
        safe: true,
      },
    );
    return catagory;
  }

  async findAllAndPullBrands(brandId: string) {
    const catagory = this.catagoryModel.updateMany(
      { brands: brandId },
      { $pull: { brands: brandId } },
      {
        safe: true,
      },
    );
    return catagory;
  }

  async delete(id: string) {
    const deletedCategory = await this.catagoryModel
      .findByIdAndDelete(id)
      .exec();
    return deletedCategory;
  }
}
