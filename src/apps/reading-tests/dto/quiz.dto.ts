import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';

export class QuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly question: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  readonly answers: [string];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly options: [string];
}
