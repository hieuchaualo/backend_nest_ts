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
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, RegisterAccountDto, UpdateAccountDto, UpdateForAccountDto } from './dto';
import { LoginAccountDto } from './dto/login-account.dto';
import { IAccount } from './interfaces/account.interface';
import { HasRoles, Pagination, Role, RolesGuard, SearchDto } from '../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const avatarMulterOptions = {
  storage: diskStorage({
    destination: './pictures/avatars'
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

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  // ==========================================
  // NO AUTHENTICATION

  @Post('login')
  async login(@Body() loginAccountDto: LoginAccountDto) {
    const account = await this.accountsService.login(loginAccountDto);
    return account;
  }

  @Post('register')
  async register(@Body() registeredAccountDto: RegisterAccountDto) {
    const account = await this.accountsService.register(registeredAccountDto);
    return account;
  }

  // ==========================================
  // REQUIRED AUTHENTICATION

  @Get()
  @UseGuards(AuthGuard("jwt"))
  getMyInfo(@Request() req: any): IAccount {
    return req.user
  }

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterOptions))
  async updateAvatar(
    @Body() updateAccountDto: UpdateAccountDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IAccount> {
    return this.accountsService.updateAvatar(updateAccountDto, file);
  }

  @Patch()
  @UseGuards(AuthGuard("jwt"))
  async updateAccountInfo(
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<IAccount> {
    return this.accountsService.findByIdAndUpdate(updateAccountDto);
  }

  // ==========================================
  // REQUIRED ADMIN AUTHORIZATION

  @Post('managements/register')
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async createAccount(
    @Request() req: any,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    const account = await this.accountsService.create(createAccountDto);
    return account;
  }

  @Get('managements')
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  getAllAccounts(
    @Request() req: any,
    @Query() searchMiniTestDto: SearchDto,
  ): Promise<Pagination> {
    return this.accountsService.searchAccounts(searchMiniTestDto);
  }

  @Get('managements/:id')
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  getAccountById(@Param('id') id: string,) {
    return this.accountsService.findById(id);
  }

  @Patch('managements/:id')
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async updateForAccount(
    @Request() req: any,
    @Body() updateForAccountDto: UpdateForAccountDto,
  ): Promise<IAccount> {
    return this.accountsService.findByIdAndUpdate(updateForAccountDto);
  }

  @Delete('managements/:id')
  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async deleteAnAccount(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.accountsService.findByIdAndDelete(id);
  }
}
