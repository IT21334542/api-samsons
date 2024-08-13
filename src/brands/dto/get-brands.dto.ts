import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { Brand } from '../entities/brand.entity';

export class BrandPaginator extends Paginator<Brand> {
  data: Brand[];
}

export class GetBrandDto extends PaginationArgs {
  orderBy?: BrandOrderBY;
  sortedBy?: SortOrder;
  search?: string;
  parent?: number | string = 'null';
  language?: string;
}

export enum BrandOrderBY {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}
