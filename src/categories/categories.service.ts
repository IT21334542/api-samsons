import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import Fuse from 'fuse.js';
import categoriesJson from '@db/categories.json';
import { paginate } from 'src/common/pagination/paginate';
import { PrismaService } from 'src/prisma/prisma.service';

const categories = plainToClass(Category, categoriesJson);
const options = {
  keys: ['name', 'type.slug'],
  threshold: 0.3,
};
const fuse = new Fuse(categories, options);

@Injectable()
export class CategoriesService {
  constructor(private prisma:PrismaService){}

 async create(createCategoryDto: CreateCategoryDto) {


    


    const newCategory= await this.prisma.category.create({
      data:{
        name:createCategoryDto.name,
        language:'en',
        slug:createCategoryDto.slug,
        details:createCategoryDto.details,
        image:createCategoryDto.image[0] ?? null,
        icon:createCategoryDto.icon,
        imageId:null,
        typeId:Number(createCategoryDto.type_id),
        parentId:(createCategoryDto.parent !=null)?Number(createCategoryDto.parent):null
      }
    })
    // const newCategory:Category = {
      
    // }
    return newCategory;
  }

  async getCategories({ limit, page, search, parent }: GetCategoriesDto) {
   
    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   console.log(parseSearchParams)
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     // data = data.filter((item) => item[key] === value);
    //     data = fuse.search(value)?.map(({ item }) => item);
    //   }
    // }
   
   
   
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    // if (hasType) {
    //   data = fuse.search(hasType)?.map(({ item }) => item);
    // }

    // console.log(data);
   /* 
   const results = data.slice(startIndex, endIndex);
    const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
    
    */
   var Catos:any|null = null;
   
  Catos = await this.prisma.category.findMany({
    include:{
      type:true,
      parentCategory:true,
      children:true
    },
   })
   if (parent === 'null') {
    Catos = await this.prisma.category.findMany({
      include:{
        type:true,
        parentCategory:true,
        children:true
      },
      where:{
        parentId:null
      },
      take:Number(limit)
     })
      
   }
   const results = Catos.slice(startIndex, endIndex)
   const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
   return {
      data: Catos,
      ...paginate(Catos.length, page, limit, results.length, url),
    };;
  }

  async getCategory(param: string, language: string):Promise<any> {
    // return this.categories.find(
    //   (p) => p.id === Number(param) || p.slug === param,
    // );
    const Cato = await this.prisma.category.findFirst({
      where:{
        OR:[
          {
            slug:param
          },
          {
            id:Number(param)
          }
        ]
      }
    })
    return Cato;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
