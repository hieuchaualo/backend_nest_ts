import { PartialType } from '@nestjs/swagger';
import { CreateReadingTipDto } from './create-reading-tip.dto';

export class UpdateReadingTipDto extends PartialType(CreateReadingTipDto) {}
