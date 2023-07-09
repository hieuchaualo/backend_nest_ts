import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsNumber, Max, Min } from 'class-validator';

export class GetSuggetedProductDto {
  @ApiProperty()
  @IsMongoId()
  readonly id: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100) //for API, not for front end
  @IsOptional()
  readonly limit: number;
}
