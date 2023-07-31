import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CreateReadingTipDto } from './dto';
import { ReadingTipsService } from './reading-tips.service';
import { ReadingTip } from './schemas';
import { diskStorage } from 'multer'
import { extname } from 'path'
import { AuthGuard } from '@nestjs/passport';
import { HasRoles, Pagination, Role, RolesGuard, SearchDto } from '../utils';

const multerOptions = {
  storage: diskStorage({
    destination: './pictures/reading-tip-thumbnails'
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

@Controller('reading-tips')
@ApiTags('reading-tips')
export class ReadingTipsController {
  constructor(private readonly readingTipsService: ReadingTipsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail', multerOptions))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateReadingTipDto,
  ): Promise<ReadingTip> {
    return this.readingTipsService.createReadingTip(body, file);
  }

  @Get()
  async searchReadingTips(
    @Query() searchReadingTipDto: SearchDto,
  ): Promise<Pagination> {
    return this.readingTipsService.searchReadingTips(searchReadingTipDto);
  }

  @Get(':id')
  async getReadingTip(@Param('id') id: string): Promise<ReadingTip> {
    return this.readingTipsService.getReadingTipById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail', multerOptions))
  async findByIdAndUpdate(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    return this.readingTipsService.findReadingTipByIdAndUpdate(id, file, body);
  }

  @Patch('no-thumbnail/:id')
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async findByIdAndUpdateNoThumbnail(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.readingTipsService.findReadingTipByIdAndUpdateNoThumbnail(id, body);
  }

  @Delete(':id')
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async delete(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.readingTipsService.deleteReadingTipById(id);
  }
}