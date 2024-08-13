import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { GetBrandDto } from './dto/get-brands.dto';
import { UpdateCategoryDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import Fuse from 'fuse.js';
import BrandJSON from '@db/brands.json';
import { paginate } from 'src/common/pagination/paginate';

const brands = plainToClass(Brand, BrandJSON);
const options = {
  keys: ['name', 'slug'],
  threshold: 0.3,
};
const fuse = new Fuse(brands, options);

@Injectable()
export class CategoriesService {
  private brands: Brand[] = brands;

  create(CreateBrandDTO: CreateBrandDTO) {
    return this.brands[0];
  }

  getCategories({ limit, page, search, parent }: GetBrandDto) {
    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Brand[] = this.brands;
    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     // data = data.filter((item) => item[key] === value);
    //     data = fuse.search(value)?.map(({ item }) => item);
    //   }
    // }
    // if (parent === 'null') {
    //   data = data.filter((item) => item.parent === null);
    // }
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    // if (hasType) {
    //   data = fuse.search(hasType)?.map(({ item }) => item);
    // }

    const results = data.slice(startIndex, endIndex);
    const url = `/brands?search=${search}&limit=${limit}&parent=${parent}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getCategory(param: string, language: string): Brand {
    return this.brands.find(
      (p) => p.id === Number(param) || p.slug === param,
    );
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.brands[0];
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
