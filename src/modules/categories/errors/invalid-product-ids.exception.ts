import { BadRequestException } from '@nestjs/common';

export class InvalidProductIdsException extends BadRequestException {
  constructor(productIds: string[]) {
    super(
      `Os seguintes IDs de produtos não existem: ${productIds.join(', ')}.`,
    );
  }
}
