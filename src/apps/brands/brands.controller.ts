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
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { Brand } from './schemas/brand.schema';

@Controller('brands')
@ApiTags('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async create(@Body() createBrandDto: CreateBrandDto) {
    await this.brandsService.create(createBrandDto);
  }

  @Get()
  async findMany(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Brand> {
    return this.brandsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  async findByIdAndUpdate(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.findByIdAndUpdate(id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  async delete(@Param('id') id: string) {
    return this.brandsService.delete(id);
  }
}
