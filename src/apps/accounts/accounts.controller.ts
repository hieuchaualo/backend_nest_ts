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
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { LoginAccountDto } from './dto/login-account.dto';
import { IAccount } from './interfaces/account.interface';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Post('signin')
  async signin(@Body() loginAccountDto: LoginAccountDto) {
    const account = await this.accountsService.signin(loginAccountDto);
    return account;
  }

  @Post('create')
  async create(@Body() createAccountDto: CreateAccountDto) {
    const account = await this.accountsService.create(createAccountDto);
    return account;
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  getUserInfo(@Request() req) {
    return req.user
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  async findByIdAndUpdate(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<IAccount> {
    return this.accountsService.findByIdAndUpdate(id, updateAccountDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  async delete(@Param('id') id: string) {
    return this.accountsService.delete(id);
  }
}
