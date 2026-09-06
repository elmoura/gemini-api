import { BadRequestException } from '@nestjs/common';

export class PaymentExceedsTotalException extends BadRequestException {
  constructor() {
    super('O valor do pagamento excede o total pendente da comanda');
  }
}
