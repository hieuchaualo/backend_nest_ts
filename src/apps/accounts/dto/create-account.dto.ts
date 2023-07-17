import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Role } from 'src/apps/utils';

export class CreateAccountDto {
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

  @ApiPropertyOptional()
  @IsArray({ each: true })
  @IsOptional()
  roles: [Role];
}
