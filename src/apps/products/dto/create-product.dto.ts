import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  MinLength,
  IsMongoId,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  readonly name: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  readonly category: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  readonly brand: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  readonly account: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  @Max(1000000000)
  readonly price: number;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(500)
  @IsOptional()
  readonly description: string;
}
