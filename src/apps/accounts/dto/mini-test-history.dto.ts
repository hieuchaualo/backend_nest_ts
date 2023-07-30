import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
} from 'class-validator';

export class MiniTestHistoryDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  miniTest: string;

  @ApiProperty()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  timeTaken: number;

  @ApiProperty()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  totalQuestions: number;

  @ApiProperty()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  totalCorrectAnswers: number;
}
