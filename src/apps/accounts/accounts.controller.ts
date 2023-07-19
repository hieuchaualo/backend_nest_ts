import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, RegisterAccountDto, UpdateAccountDto, UpdateForAccountDto } from './dto';
import { LoginAccountDto } from './dto/login-account.dto';
import { IAccount } from './interfaces/account.interface';
import { Role, Roles } from '../utils';

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

  @Patch()
  @UseGuards(AuthGuard("jwt"))
  async updateMyInfo(
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<IAccount> {
    return this.accountsService.findByIdAndUpdate(updateAccountDto);
  }

  // ==========================================
  // REQUIRED ADMIN AUTHORIZATION

  @Post('create')
  @UseGuards(AuthGuard("jwt"))
  @Roles(Role.Admin)
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    const account = await this.accountsService.create(createAccountDto);
    return account;
  }

  @Get(':id')
  @UseGuards(AuthGuard("jwt"))
  @Roles(Role.Admin)
  getAccountById(@Param('id') id: string,) {
    return this.accountsService.findById(id);
  }

  @Get(':all')
  @UseGuards(AuthGuard("jwt"))
  @Roles(Role.Admin)
  getAllAccounts(@Param('limit') limit: string,) {
    return this.accountsService.findAll(limit);
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  @Roles(Role.Admin)
  async updateForAccount(
    @Body() updateForAccountDto: UpdateForAccountDto,
  ): Promise<IAccount> {
    return this.accountsService.findByIdAndUpdate(updateForAccountDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  @Roles(Role.Admin)
  async deleteAnAccount(@Param('id') id: string) {
    return this.accountsService.findByIdAndDelete(id);
  }
}
