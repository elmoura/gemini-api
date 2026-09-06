import { ConflictException } from '@nestjs/common';

export class CashRegisterAlreadyOpenException extends ConflictException {
  constructor() {
    super('Já existe caixa aberto nesta unidade');
  }
}
