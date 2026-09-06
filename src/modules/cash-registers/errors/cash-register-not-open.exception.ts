import { ConflictException } from '@nestjs/common';

export class CashRegisterNotOpenException extends ConflictException {
  constructor() {
    super('Abra o caixa antes de registrar pagamentos.');
  }
}
