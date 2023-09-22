import { BadRequestException } from '@nestjs/common';

export class TableOrderAlreadyClosedException extends BadRequestException {
  constructor() {
    super(
      'Opa, parece que esse pedido já foi fechado! Caso esteja tentando fazer alguma alteração, tente abrir o pedido novamente e realizar as alterações desejadas.',
    );
  }
}
