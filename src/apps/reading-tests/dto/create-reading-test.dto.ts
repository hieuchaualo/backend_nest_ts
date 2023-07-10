import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { QuizDto } from './quiz.dto';

export class CreateReadingTestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => QuizDto)
  readonly quiz: [QuizDto];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly thumbnail: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  readonly creator: string;
}
