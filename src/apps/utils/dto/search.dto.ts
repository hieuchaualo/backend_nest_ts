import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class SearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  @IsOptional()
  readonly keywords: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100) //for API, not for front end
  @IsOptional()
  readonly limit: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly page: number;
}
