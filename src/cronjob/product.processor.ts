import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from 'src/db/prisma.services';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Processor('price-update')
export class ProductProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  @Process()
  async handlePriceUpdate(job: Job) {
    const { title, productId } = job.data;
    const searchTerms = this.getSearchTerm(title);
    if (!searchTerms) {
      console.error(`Nenhum termo de busca encontrado para ${title}`);
      return;
    }

    const newPrices = await this.fetchNewPrices(searchTerms);
    if (newPrices) {
      await this.prisma.price.create({
        data: {
          value: newPrices.min,
          productId,
          createdAt: new Date(),
        },
      });

      await this.prisma.price.create({
        data: {
          value: newPrices.med,
          productId,
          createdAt: new Date(),
        },
      });

      await this.prisma.price.create({
        data: {
          value: newPrices.max,
          productId,
          createdAt: new Date(),
        },
      });

      await this.prisma.product.update({
        where: { id: productId },
        data: {
          minPrice: newPrices.min,
          medPrice: newPrices.med,
          maxPrice: newPrices.max,
        },
      });

      console.log(
        `Preços atualizados para ${title}: min ${newPrices.min}, med ${newPrices.med}, max ${newPrices.max}`,
      );
    } else {
      console.error(`Não foi possível obter os preços para ${title}`);
    }
  }

  private getSearchTerm(title: string): string | null {
    const searchTermsMap: { [key: string]: string } = {
      'Notebook Samsung Galaxy Book2': 'notebook',
      'iPhone 14': 'iphone%2014',
      "Smartwatch Amazfit Gts 4'": 'amazfit%20gts%204',
    };
    return searchTermsMap[title] || null;
  }

  private async fetchNewPrices(
    searchTerm: string,
    retries = 3,
    delay = 1000,
  ): Promise<{ min: number; med: number; max: number } | null> {
    const url = `http://85.31.60.80:26500/search?text=${searchTerm}`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { maxContentLength: 1000000 }),
      );
      if (response.status === 200) {
        const prices = this.extractPrices(response.data);
        return prices;
      } else {
        console.error(
          `Erro ao buscar preços para ${searchTerm}: Falha na solicitação com código de status ${response.status}`,
        );
        if (response.status === 503 && retries > 0) {
          console.log(`Tentando novamente em ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.fetchNewPrices(searchTerm, retries - 1, delay * 2);
        }
        return null;
      }
    } catch (error) {
      console.error(
        `Erro ao buscar preços para ${searchTerm}: ${error.message}`,
      );
      if (
        error.response &&
        (error.response.status === 503 || error.response.status === 404) &&
        retries > 0
      ) {
        console.log(`Tentando novamente em ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchNewPrices(searchTerm, retries - 1, delay * 2);
      }
      return null;
    }
  }

  private extractPrices(
    data: any,
  ): { min: number; med: number; max: number } | null {
    if (data && data.data && data.data.prices) {
      const { min, med, max } = data.data.prices;
      return { min, med, max };
    }
    return null;
  }
}
