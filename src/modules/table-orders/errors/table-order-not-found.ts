import { BadRequestException } from '@nestjs/common';

export class TableOrderNotFoundException extends BadRequestException {
  constructor() {
    super('O pedido informado não foi encontrada :(');
  }
}
