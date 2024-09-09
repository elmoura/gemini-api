import { BadRequestException } from '@nestjs/common';

export class CategoryNotFoundException extends BadRequestException {
  constructor(categoryId: string) {
    super(`A categoria "${categoryId}" não foi encontrada :(`);
  }
}
