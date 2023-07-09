import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsNotEmpty, MinLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  readonly category: string;
}
