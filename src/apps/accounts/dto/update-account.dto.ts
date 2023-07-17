import { PartialType } from '@nestjs/swagger';
import { RegisterAccountDto } from './register-account.dto';
export class UpdateAccountDto extends PartialType(RegisterAccountDto) {}
