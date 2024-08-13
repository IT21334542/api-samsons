import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

import typesJson from '@db/types.json';
import Fuse from 'fuse.js';
import { GetTypesDto } from './dto/get-types.dto';
import { PrismaService } from 'src/prisma/prisma.service';


const types = plainToClass(Type, typesJson);
const options = {
  keys: ['name'],
  threshold: 0.3,
};
const fuse = new Fuse(types, options);

@Injectable()
export class TypesService {
 

  constructor(private prisma:PrismaService){}
 

  async getTypes({ text, search }: GetTypesDto) {
    console.log("type Searches :"+text,search);
    
    /*
    let data: Type[] = this.types;
    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }

    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
        if (key !== 'slug') {
          searchText.push({
            [key]: value,
          });
        }
      }

      data = fuse
        .search({
          $and: searchText,
        })
        ?.map(({ item }) => item);
    }

    return data;

    */
   

    const types = await this.prisma.type.findMany({
      include:{
        banners:true,
        categories:true,
        TypeSettings:{
          include:{
            category:true,
            featuredproducts:true,
            newArrival:true
          }
        }
      }
    })

    return types;



  }

  async getTypeBySlug(slug: string): Promise<any|null> {
    const type = await this.prisma.type.findFirst({
      where:{
        slug:slug
      },
      include:{
        banners:true,
        categories:true,
        TypeSettings:{
          include:{
            category:true,
            featuredproducts:true,
            newArrival:true
          }
        }
      }

    })
    return type;
  }

  async create(createTypeDto: CreateTypeDto) {
    console.log(createTypeDto);
    const newType = await this.prisma.type.create({
      data:{
        name:"name",
        icon:"icon",
        slug:"slug",
      }
    });

    
    return newType;
  }

  findAll() {
    return `This action returns all types`;
  }

  findOne(id: number) {
    return `This action returns a #${id} type`;
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} type`;
  }
}
