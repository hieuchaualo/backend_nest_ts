import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {
  GetSuggetedProductDto,
  SearchProductDto,
  Pagination,
} from './dto';
import { ProductsService } from './products.service';
import { Product } from './schemas';
import { diskStorage } from 'multer'
import { extname } from 'path'
import { AuthGuard } from '@nestjs/passport';

const multerOptions = {
  storage: diskStorage({
    destination: './pictures/products'
    , filename: (req, file, callback) => {
      // make a gud name :))
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3)
      const newFileName = `${req.body.name.replace(/\s/g, '_')}_${uniqueSuffix}${extname(file.originalname)}`
      //Calling the callback passing the random name generated with the original extension name
      callback(null, newFileName)
    }
  }),
  fileFilter: (req, file, callback) => {
    if (file.mimetype == "image/png"
      || file.mimetype == "image/jpg"
      || file.mimetype == "image/jpeg"
    ) {
      callback(null, true)
    } else {
      console.error('Only .png, .jpg and .jpeg format allowed!')
      callback(new Error('Only .png, .jpg and .jpeg format allowed!'), false)
    }
  },
  limits: {
    fileSize: (1024 * 1024) * 2, // 2MB
  }
}

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(
    @UploadedFile() pictures: Express.Multer.File,
    @Body() body,
  ): Promise<Product> {
    return this.productsService.create(body, pictures);
  }

  @Get()
  async searchProducts(
    @Query() searchProductDto: SearchProductDto,
  ): Promise<Pagination> {
    return this.productsService.searchProducts(searchProductDto);
  }

  @Get('detail/:id')
  async getProductDetail(@Param('id') id: string): Promise<Product> {
    return this.productsService.getProductDetail(id);
  }

  @Get('suggeted')
  async getSuggetedProduct(
    @Query() getSameProductDto: GetSuggetedProductDto,
  ): Promise<Product[]> {
    return this.productsService.getSameProductsBrandOrCategory(
      getSameProductDto,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FilesInterceptor('files', 5, multerOptions))
  async findByIdAndUpdate(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    return this.productsService.findByIdAndUpdate(id, files, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
