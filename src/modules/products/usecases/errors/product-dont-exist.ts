import { BadRequestException } from '@nestjs/common';

export class ProductDontExistError extends BadRequestException {
  constructor(productId: string) {
    super(`Product with ID ${productId} don't exist.`);
  }
}
