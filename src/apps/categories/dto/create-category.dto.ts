import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  readonly name: string;

  // @ApiPropertyOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Brand)
  // @IsNotEmpty()
  // @IsOptional()
  // readonly brands: [Brand];
}
