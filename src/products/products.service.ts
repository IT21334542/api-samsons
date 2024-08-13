import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { paginate } from 'src/common/pagination/paginate';
import productsJson from '@db/products.json';
import popularProductsJson from '@db/popular-products.json';
import bestSellingProductsJson from '@db/best-selling-products.json';
import Fuse from 'fuse.js';
import { GetPopularProductsDto } from './dto/get-popular-products.dto';
import { GetBestSellingProductsDto } from './dto/get-best-selling-products.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const products = plainToClass(Product, productsJson);
const popularProducts = plainToClass(Product, popularProductsJson);
const bestSellingProducts = plainToClass(Product, bestSellingProductsJson);

const options = {
  keys: [
    'name',
    'type.slug',
    'categories.slug',
    'status',
    'shop_id',
    'author.slug',
    'tags',
    'manufacturer.slug',
  ],
  threshold: 0.3,
};
const fuse = new Fuse(products, options);

@Injectable()
export class ProductsService {
  constructor(private prisma:PrismaService){} 

  async create(createProductDto: CreateProductDto) {
    

    
    const replacedString = createProductDto.name.replace(/\s+/g, '-').toLowerCase();
    const trimmedString = replacedString.replace(/-+$/, '');
    const newProduct = await this.prisma.product.create({
      data:{
        name:createProductDto.name,
        sku:createProductDto.sku,
        quantity:createProductDto.quantity,
        inin_stock:Number(createProductDto.in_stock),
        slug:trimmedString,
        rrp:createProductDto.price,
        packsize:createProductDto.packsize,
        unit:createProductDto.unit,
        is_bestselling:true,
        is_popularproduct:true,
        image:createProductDto.image,
        in_wishlist:createProductDto.in_wishlist,
        shopid:createProductDto.shop_id,
        type_id:createProductDto.type_id,
        product_type:"SIMPLE"
      }
    });

    createProductDto.categories.map(async (cat,index)=>{

      const category = await this.prisma.productCategory.create({
        data:{
          productid:newProduct.id,
          categoryid:cat
        }
      })
    })

    const Bulkprices = await this.prisma.bulkPrice.createMany({
      data:[
        {
          productid:newProduct.id,
          por:5,
          case:1,
          price:10
        },
        {
          productid:newProduct.id,
          por:7,
          case:5,
          price:8
        }
      ]
    })

    const ProductGallery = await this.prisma.productGallery.create({
      data:{
        orginal:"https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/489/Juice-5_eqrtuu.jpg",
        name:newProduct.name,
        productid:newProduct.id,
      }
    });
    return newProduct;
  }

  async getProducts({ limit, page, search }: GetProductsDto): Promise<any> {
    
 
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    var data = null;
    var skeys =null;
    var option ={};
    var optionCat =null
    var st = "p";
    var cg = "";
    if (search) {
      skeys= 10;
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {

        const sk = searchParam.split(':');
        if(sk[0] == "status"){
          st = (sk[1] == "publish")?option["status"] = "PUBLISH":option["status"] = "DRAFT";
        }

        if(sk[0] == "type.slug"){
          option["type"] = {
            slug:sk[1]

          }
        }

        if(sk[0] == "categories.slug"){
          console.log("has cato and valueis ",sk[1])
          
          optionCat = sk[1];
          const {id} = await this.prisma.category.findUnique({
            where:{
              slug:sk[1]
            }
          })
            
        }
        // TODO: Temp Solution

      
        
      }}


    
       if(optionCat !=null){
        
        var products = await this.prisma.product.findMany({
          include:{
            BulkPrice:true,
            ProductGallery:true,
            ProductCategory:{
              where:{
                category:{
                  slug:optionCat
                }
              }
            }
            ,
          },
          where:option
          
        })

       
        data = products;
        if(optionCat){

         data= data.filter((prod:any)=>{
          if(prod.ProductCategory.length!=0){
            return prod;
          }
         })
          
        }
    
      }
      else if(skeys !=null){

        var s = await this.prisma.product.findMany({
          include:{
            BulkPrice:true,
            ProductGallery:true,
            ProductCategory:{
              include:{
                category:true
              }
            }
            ,
          },
          where:option
          
        })

        data = s;

      }
      else{
        const products = await this.prisma.product.findMany({
          include:{
            BulkPrice:true,
            ProductGallery:true,
            ProductCategory:{
              include:{
                category:true
              }
            },
            type:true,
            shop:true
          },
        })
        data = products;
      }
  
    

      // data = fuse
      //   .search({
      //     $and: searchText,
      //   })
      //   ?.map(({ item }) => item);

    const results = data.slice(startIndex, endIndex);
    const url = `/products?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
    
  }

 async getProductBySlug(slug: string): Promise<any> {
    const products = await this.prisma.product.findMany({
      include:{
        BulkPrice:true,
        ProductGallery:true,
        
        ProductCategory:{
          include:{
            category:true
          }
        },
        type:true
      },
      where:{
        slug:slug
      }
      
    })
    return products;
  }

 async getPopularProducts({ limit, type_slug }: GetPopularProductsDto): Promise<any> {
  console.log("typeSlug is "+type_slug);  
  const products = await this.prisma.product.findMany({
      include:{
        BulkPrice:true,
        ProductGallery:true,
        ProductCategory:true,
      },
      where:{
        is_popularproduct:true,
        type:{
          slug:type_slug
        }
      },
      
      
    })




    return products;
  }
 async getBestSellingProducts({ limit, type_slug }: GetBestSellingProductsDto): Promise<any> {
    const products = await this.prisma.product.findMany({
      include:{
        BulkPrice:true,
        ProductGallery:true,
        ProductCategory:true,
      },
      where:{
        is_bestselling:true,
        type:{
          slug:type_slug
        }
      },
      
      
    })

    return products;
  }

  getProductsStock({ limit, page, search }: GetProductsDto): ProductPaginator {
    // if (!page) page = 1;
    // if (!limit) limit = 30;
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // let data: Product[] = this.products.filter((item) => item.quantity <= 9);

    // if (search) {
    //   const parseSearchParams = search.split(';');
    //   const searchText: any = [];
    //   for (const searchParam of parseSearchParams) {
    //     const [key, value] = searchParam.split(':');
    //     // TODO: Temp Solution
    //     if (key !== 'slug') {
    //       searchText.push({
    //         [key]: value,
    //       });
    //     }
    //   }

    //   data = fuse
    //     .search({
    //       $and: searchText,
    //     })
    //     ?.map(({ item }) => item);
    // }

    // const results = data.slice(startIndex, endIndex);
    // const url = `/products-stock?search=${search}&limit=${limit}`;
    // return {
    //   data: results,
    //   ...paginate(data.length, page, limit, results.length, url),
    // };
    return null;
  }

  async getDraftProducts({ limit, page, search }: GetProductsDto):Promise<any> {
     if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const data = await this.prisma.product.findMany({
      include:{
        BulkPrice:true,
        ProductGallery:true,
        ProductCategory:true,
      },
      where:{
        status:'DRAFT',
        
      },
      take:Number(limit)
      
    })

   
    const results = data.slice(startIndex, endIndex);
    const url = `/draft-products?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };

    
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    // return this.products[0];
    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
