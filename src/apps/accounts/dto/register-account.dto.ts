import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
} from 'class-validator';

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
}
