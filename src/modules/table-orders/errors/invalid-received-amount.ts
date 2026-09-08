import { BadRequestException } from '@nestjs/common';

export class InvalidReceivedAmountException extends BadRequestException {
  constructor() {
    super(
      'O valor recebido em dinheiro deve ser maior ou igual ao valor do pagamento',
    );
  }
}
