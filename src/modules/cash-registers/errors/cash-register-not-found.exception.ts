import { NotFoundException } from '@nestjs/common';

export class CashRegisterNotFoundException extends NotFoundException {
  constructor() {
    super('Caixa não encontrado');
  }
}
