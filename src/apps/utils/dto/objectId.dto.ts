import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
} from 'class-validator';

export class ObjectIdDto {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
