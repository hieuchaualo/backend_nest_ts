import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './schemas/category.schema';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async getCategoriesAndBrands(): Promise<Category[]> {
    return this.categoriesService.getCategoriesAndBrands();
  }

  @Get(':id')
  async getCategoryAndBrands(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.getCategoryAndBrands(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  async findByIdAndUpdate(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.findByIdAndUpdate(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

  @Delete(':id/:brandId')
  @UseGuards(AuthGuard("jwt"))
  async deleteBrandId(
    @Param('id') id: string,
    @Param('brandId') brandId: string,
  ) {
    return this.categoriesService.findByIdAndPullBrands(id, brandId);
  }
}
