import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import {
  ApproveShopController,
  DisapproveShopController,
  ShopsController,
  StaffsController,
  NearByShopController,
  NewShopsController,
} from './shops.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [
    ShopsController,
    StaffsController,
    DisapproveShopController,
    ApproveShopController,
    NearByShopController,
    NewShopsController,
  ],
  providers: [ShopsService,PrismaService],
})
export class ShopsModule {}
