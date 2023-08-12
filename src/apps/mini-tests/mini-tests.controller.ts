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
import { CreateMiniTestDto } from './dto';
import { MiniTestsService } from './mini-tests.service';
import { MiniTest } from './schemas';
import { diskStorage } from 'multer'
import { extname } from 'path'
import { AuthGuard } from '@nestjs/passport';
import { HasRoles, Pagination, Role, RolesGuard, SearchDto } from '../utils';
import { IAccount, IMiniTestHistory } from '../accounts/interfaces';
import { MiniTestHistoryDto } from '../accounts/dto';

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

  @Get('next')
  async getNextMiniTestId(
    @Query('id') id: string,
  ): Promise<MiniTest[]> {
    return this.miniTestsService.getNextMiniTestById(id);
  }

  @Get('history')
  @UseGuards(AuthGuard("jwt"))
  async getMiniTestHistory(
    @Request() req: any,
  ): Promise<IMiniTestHistory[]> {
    return this.miniTestsService.getMiniTestHistory(req.user._id.toString());
  }

  @Patch('history')
  @UseGuards(AuthGuard("jwt"))
  async updateMiniTestHistory(
    @Request() req: any,
    @Body() miniTestHistoryDto: MiniTestHistoryDto,
  ): Promise<IAccount> {
    return this.miniTestsService.updateMiniTestHistory(req.user._id.toString(), miniTestHistoryDto);
  }

  @Delete('history')
  @UseGuards(AuthGuard("jwt"))
  async resetMiniTestHistory(@Request() req: any): Promise<IAccount> {
    return this.miniTestsService.resetMiniTestHistory(req.user._id.toString());
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
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async findByIdAndUpdateNoThumbnail(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.miniTestsService.findMiniTestByIdAndUpdateNoThumbnail(id, body);
  }

  @Delete(':id')
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async delete(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.miniTestsService.deleteMiniTestById(id);
  }
}