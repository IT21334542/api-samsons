import { PartialType } from '@nestjs/swagger';
import { CreateBrandDTO } from './create-brand.dto';

export class UpdateCategoryDto extends PartialType(CreateBrandDTO) {}
