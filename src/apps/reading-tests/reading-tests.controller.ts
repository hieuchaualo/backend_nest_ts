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
import { CreateReadingTestDto } from './dto';
import { ReadingTestsService } from './reading-tests.service';
import { ReadingTest } from './schemas';
import { diskStorage } from 'multer'
import { extname } from 'path'
import { AuthGuard } from '@nestjs/passport';
import { Pagination, SearchDto } from '../utils';

const multerOptions = {
  storage: diskStorage({
    destination: './pictures/reading-test-thumbnails'
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

@Controller('reading-tests')
@ApiTags('reading-tests')
export class ReadingTestsController {
  constructor(private readonly readingTestsService: ReadingTestsService) { }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor('thumbnail', multerOptions))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateReadingTestDto,
  ): Promise<ReadingTest> {
    return this.readingTestsService.createReadingTest(body, file);
  }

  @Get()
  async searchReadingTests(
    @Query() searchReadingTestDto: SearchDto,
  ): Promise<Pagination> {
    return this.readingTestsService.searchReadingTests(searchReadingTestDto);
  }

  @Get(':id')
  async getReadingTest(@Param('id') id: string): Promise<ReadingTest> {
    return this.readingTestsService.getReadingTestById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor('thumbnail', multerOptions))
  async findByIdAndUpdate(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    return this.readingTestsService.findReadingTestByIdAndUpdate(id, file, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  async delete(@Param('id') id: string) {
    return this.readingTestsService.deleteReadingTestById(id);
  }
}