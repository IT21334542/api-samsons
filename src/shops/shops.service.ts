import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import shopsJson from '@db/shops.json';
import nearShopJson from '@db/near-shop.json';
import Fuse from 'fuse.js';
import { GetShopsDto } from './dto/get-shops.dto';
import { paginate } from 'src/common/pagination/paginate';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const shops = plainToClass(Shop, shopsJson);
const nearShops = plainToClass(Shop, nearShopJson);
const options = {
  keys: ['name', 'type.slug', 'is_active'],
  threshold: 0.3,
};
const fuse = new Fuse(shops, options);

@Injectable()
export class ShopsService {


  constructor(private prisma:PrismaService){}

  async create(createShopDto: CreateShopDto) {
    // return this.shops[0];
    console.log("createShopDto");
    console.log(createShopDto);
    const replacedString = createShopDto.name.replace(/\s+/g, '-').toLowerCase();
    const trimmedString = replacedString.replace(/-+$/, '');

    const Shop = await this.prisma.shop.create({
      data:{
        name:createShopDto.name,
        slug:trimmedString,
        cover_image:"",
        logo:"",
        description:createShopDto.description
      }
    })
    return Shop;
  }

 async getShops({ search, limit, page }: GetShopsDto) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    var shipis:any|null = null;
   
  shipis = await this.prisma.shop.findMany({
    include:{
      Product:true,
    },
    take:Number(limit)
   }) 
   
   
   const results = shipis.slice(startIndex, endIndex)
   const url = `/shops?search=${search}&limit=${limit}`
   return {
      data: shipis,
      ...paginate(shipis.length, page, limit, results.length, url),
    };;
    // let data: Shop[] = this.shops;
    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     // data = data.filter((item) => item[key] === value);
    //     data = fuse.search(value)?.map(({ item }) => item);
    //   }
    // }
    // // if (text?.replace(/%/g, '')) {
    // //   data = fuse.search(text)?.map(({ item }) => item);
    // // }
    // const results = data.slice(startIndex, endIndex);
    // const url = `/shops?search=${search}&limit=${limit}`;

    // return {
    //   data: results,
    //   ...paginate(data.length, page, limit, results.length, url),
    // };
    return null;
  }

  getNewShops({ search, limit, page }: GetShopsDto) {
    // if (!page) page = 1;

    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // let data: Shop[] = this.shops.filter(
    //   (shopItem) => Boolean(shopItem.is_active) === false,
    // );

    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     data = fuse.search(value)?.map(({ item }) => item);
    //   }
    // }
    // const results = data.slice(startIndex, endIndex);
    // const url = `/new-shops?search=${search}&limit=${limit}`;

    // return {
    //   data: results,
    //   ...paginate(data.length, page, limit, results.length, url),
    // };
    return null;
  }

  getStaffs({ shop_id, limit, page }: GetStaffsDto) {
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // let staffs: Shop['staffs'] = [];
    // if (shop_id) {
    //   staffs = this.shops.find((p) => p.id === Number(shop_id))?.staffs ?? [];
    // }
    // const results = staffs?.slice(startIndex, endIndex);
    // const url = `/staffs?limit=${limit}`;

    // return {
    //   data: results,
    //   ...paginate(staffs?.length, page, limit, results?.length, url),
    // };

    return null;
  }

 async getShop(slug: string): Promise<any> {
  const shipis = await this.prisma.shop.findFirst({
    include:{
      Product:true,
    },
    where:{
      slug:slug
    }
    
   }) 
    return shipis;
  }

 

  update(id: number, updateShopDto: UpdateShopDto) {
    // return this.shops[0];
    return null;
  }

  approve(id: number) {
    return `This action removes a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }

  disapproveShop(id: number) {
    // const shop = this.shops.find((s) => s.id === Number(id));
    // shop.is_active = false;

    return null;
  }

  approveShop(id: number) {
    // const shop = this.shops.find((s) => s.id === Number(id));
    // shop.is_active = true;

    return null;
  }
}
