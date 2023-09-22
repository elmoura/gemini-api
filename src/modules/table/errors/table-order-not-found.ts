import { BadRequestException } from '@nestjs/common';

export class TableOrderNotFoundException extends BadRequestException {
  constructor() {
    super('Poxa, não encontramos esse pedido :(');
  }
}
