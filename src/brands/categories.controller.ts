import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { GetBrandDto } from './dto/get-brands.dto';
import { UpdateCategoryDto } from './dto/update-brand.dto';

@Controller('brands')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateBrandDTO) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: GetBrandDto) {
    return this.categoriesService.getCategories(query);
  }

  @Get(':param')
  findOne(@Param('param') param: string, @Query('language') language: string) {
    return this.categoriesService.getCategory(param, language);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
