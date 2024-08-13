import { PickType } from '@nestjs/swagger';
import { Brand } from '../entities/brand.entity';

export class CreateBrandDTO extends PickType(Brand, [
  'name',
  'slug',
  'products',
  'parent',
  'image',
]) {}
