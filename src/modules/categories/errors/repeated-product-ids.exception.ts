import { BadRequestException } from '@nestjs/common';

export class RepeatedProductIdsException extends BadRequestException {
  constructor(repeatedProductIds: string[]) {
    super(
      `Os itens ${repeatedProductIds.join(
        ', ',
      )} aparecem tanto para ser removidos quanto para serem adicionados.`,
    );
  }
}
