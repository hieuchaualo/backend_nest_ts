import { PartialType } from '@nestjs/swagger';
import { CreateReadingTestDto } from './create-reading-test.dto';

export class UpdateReadingTestDto extends PartialType(CreateReadingTestDto) {}
