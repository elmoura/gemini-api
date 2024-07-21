import { BadRequestException } from '@nestjs/common';

export class CategoryNotFoundException extends BadRequestException {
  constructor(categoryId: string) {
    super(`Ops! A categoria "${categoryId}" não existe.`);
  }
}
