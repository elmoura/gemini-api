import { BadRequestException } from '@nestjs/common';

export class OrderTabNotFoundException extends BadRequestException {
  constructor() {
    super('A comanda informada não foi encontrada :(');
  }
}
