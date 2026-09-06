import { BadRequestException } from '@nestjs/common';

export class OrderTabNotFullyPaidException extends BadRequestException {
  constructor() {
    super('A comanda precisa estar totalmente paga para ser finalizada');
  }
}
