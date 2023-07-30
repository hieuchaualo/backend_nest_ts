import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { MiniTestHistoryDto } from './mini-test-history.dto';

export class RegisterAccountDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  _id: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @ApiPropertyOptional()
  @IsArray({ each: true })
  @IsOptional()
  miniTestHistory: [MiniTestHistoryDto];
}
