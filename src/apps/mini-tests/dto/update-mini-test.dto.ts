import { PartialType } from '@nestjs/swagger';
import { CreateMiniTestDto } from './create-mini-test.dto';

export class UpdateMiniTestDto extends PartialType(CreateMiniTestDto) {}
