import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.services';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import axios from 'axios';

@Injectable()
export class ProductService implements OnModuleInit {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('price-update') private priceUpdateQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.schedulePriceUpdates();
  }

  async create(data: { title: string }): Promise<any> {
    const productExist = await this.prisma.product.findFirst({
      where: {
        title: data.title,
      },
    });

    if (productExist) {
      throw new Error('Product already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        title: data.title,
      },
    });
    return product;
  }

  async findAll(): Promise<any[]> {
    return this.prisma.product.findMany({
      include: {
        prices: true,
        products: true,
      },
    });
  }

  async getProductById(id: number): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
        prices: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async update(id: number, data: { title: string }): Promise<any> {
    const productExist = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!productExist) {
      throw new Error('Product not found');
    }

    return this.prisma.product.update({
      data: {
        title: data.title,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: number): Promise<any> {
    const productExist = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!productExist) {
      throw new Error('Product not found');
    }

    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async schedulePriceUpdates() {
    this.logger.log('Agendando atualizações de preços...');

    const allProducts = await this.prisma.product.findMany();
    if (!allProducts) {
      throw new Error('Produtos não encontrados');
    }

    for (const product of allProducts) {
      await this.priceUpdateQueue.add({
        title: product.title,
        productId: product.id,
      });
    }
  }

  async fetchProductDetails(url: string) {
    try {
      const response = await axios.get(url);
      if (response.status === 200 && response.data && response.data.prices) {
        const { min, med, max } = response.data.prices;
        return { min, med, max, data: response.data };
      } else {
        this.logger.error(`Falha ao buscar preços de ${url}`);
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Erro ao buscar detalhes do produto de ${url}: ${error.message}`,
      );
      return null;
    }
  }
}
