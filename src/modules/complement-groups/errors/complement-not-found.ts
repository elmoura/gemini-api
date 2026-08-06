import { NotFoundException } from '@nestjs/common';

export class ComplementNotFoundException extends NotFoundException {
  constructor() {
    super('Complemento não encontrado');
  }
}
