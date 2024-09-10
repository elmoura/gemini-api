import { BadRequestException } from '@nestjs/common';

export class InvalidCategoryIdsException extends BadRequestException {
  constructor(categoryIds: string[]) {
    super(
      `As seguintes categorias não foram encontradas: ${categoryIds.join(
        ', ',
      )}`,
    );
  }
}
