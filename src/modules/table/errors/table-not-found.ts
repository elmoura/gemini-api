import { BadRequestException } from '@nestjs/common';

export class TableNotFoundException extends BadRequestException {
  constructor() {
    super('a mesa informada não foi encontrada :(');
  }
}
