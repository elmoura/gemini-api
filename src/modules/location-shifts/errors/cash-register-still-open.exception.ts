import { ConflictException } from '@nestjs/common';

export class CashRegisterStillOpenException extends ConflictException {
  constructor() {
    super('Feche o caixa antes de encerrar o turno.');
  }
}
