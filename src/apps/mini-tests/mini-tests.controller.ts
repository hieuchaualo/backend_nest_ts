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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CreateMiniTestDto } from './dto';
import { MiniTestsService } from './mini-tests.service';
import { MiniTest } from './schemas';
import { diskStorage } from 'multer'
import { extname } from 'path'
import { AuthGuard } from '@nestjs/passport';
import { Pagination, Role, Roles, SearchDto } from '../utils';

const multerOptions = {
  storage: diskStorage({
    destination: './pictures/mini-test-thumbnails'
    , filename: (_req, file, callback) => {
      // make a gud name :))
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3)
      const newFileName = `${uniqueSuffix}${extname(file.originalname)}`
      //Calling the callback passing the random name generated with the original extension name
      callback(null, newFileName)
    }
  }),
  fileFilter: (_req, file, callback) => {
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

@Controller('mini-tests')
@ApiTags('mini-tests')
export class MiniTestsController {
  constructor(private readonly miniTestsService: MiniTestsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail', multerOptions))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMiniTestDto,
  ): Promise<MiniTest> {
    return this.miniTestsService.createMiniTest(body, file);
  }

  @Get()
  async searchMiniTests(
    @Query() searchMiniTestDto: SearchDto,
  ): Promise<Pagination> {
    return this.miniTestsService.searchMiniTests(searchMiniTestDto);
  }

  @Get(':id')
  async getMiniTest(@Param('id') id: string): Promise<MiniTest> {
    return this.miniTestsService.getMiniTestById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail', multerOptions))
  async findByIdAndUpdate(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    return this.miniTestsService.findMiniTestByIdAndUpdate(id, file, body);
  }

  @Patch('no-thumbnail/:id')
  @UseGuards(AuthGuard("jwt"))
  async findByIdAndUpdateNoThumbnail(
    @Param('id') id: string,
    @Body() body,
  ) {
    return this.miniTestsService.findMiniTestByIdAndUpdateNoThumbnail(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  async delete(@Param('id') id: string) {
    return this.miniTestsService.deleteMiniTestById(id);
  }
}