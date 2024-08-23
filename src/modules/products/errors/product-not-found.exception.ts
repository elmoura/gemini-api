import { BadRequestException } from '@nestjs/common';

export class ProductNotFoundException extends BadRequestException {
  constructor(productId: string) {
    super(`Ops! O produto "${productId}" não existe.`);
  }
}
