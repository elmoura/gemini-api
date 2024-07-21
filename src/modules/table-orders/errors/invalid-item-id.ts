import { BadRequestException } from '@nestjs/common';

export class InvalidItemId extends BadRequestException {
  constructor() {
    super('O id do item enviado é inválido');
  }
}
