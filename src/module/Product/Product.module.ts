import { Module } from '@nestjs/common';
import { ProductController } from './Product.controller';
import { PrismaService } from 'src/db/prisma.services';
import { ProductService } from './Product.service';
import { BullModule } from '@nestjs/bull';
import { ProductProcessor } from 'src/cronjob/product.processor';
import { HttpModule } from '@nestjs/axios';
import { ProductScheduler } from 'src/cronjob/schedule';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'price-update',
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    ProductProcessor,
    ProductScheduler,
  ],
})
export class ProductModule {}
