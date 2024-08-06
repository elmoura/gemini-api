import { BadRequestException } from '@nestjs/common';

export class InvalidProductId extends BadRequestException {
  constructor(id: string) {
    super(`Não foi encontrado o produto com o ID "${id}"`);
  }
}
