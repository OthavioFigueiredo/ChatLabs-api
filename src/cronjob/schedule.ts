import { Cron } from '@nestjs/schedule';
import { ProductService } from 'src/module/Product/Product.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProductScheduler {
  private readonly logger = new Logger(ProductScheduler.name);

  constructor(private readonly productService: ProductService) {}

  @Cron('* 1 * * * *')
  async handlePriceUpdates() {
    try {
      this.logger.debug('Iniciando atualização de preços...');
      await this.productService.schedulePriceUpdates();
      this.logger.log('Atualização de preços concluída.');
    } catch (error) {
      this.logger.error(
        'Erro ao agendar atualizações de preços:',
        error.message,
      );
    }
  }
}
