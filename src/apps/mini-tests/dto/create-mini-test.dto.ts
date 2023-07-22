import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { QuizDto } from './quiz.dto';
import { MiniTestTypes } from 'src/apps/utils';

export class CreateMiniTestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  @IsEnum(MiniTestTypes)
  @IsNotEmpty()
  readonly typeOfQuiz: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => QuizDto)
  readonly quizzes: [QuizDto];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly thumbnail: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  readonly creator: string;
}
