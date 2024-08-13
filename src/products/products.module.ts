import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ProductsController,
  PopularProductsController,
  ProductsStockController,
  DraftProductsController,
  BestSellingProductsController,
} from './products.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [
    ProductsController,
    PopularProductsController,
    BestSellingProductsController,
    ProductsStockController,
    DraftProductsController,
  ],
  providers: [ProductsService,PrismaService],
})
export class ProductsModule {}
