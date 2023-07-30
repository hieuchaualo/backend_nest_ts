import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateReadingTipDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  thumbnail: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  creator: string;
}
