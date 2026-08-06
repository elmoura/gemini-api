import { NotFoundException } from '@nestjs/common';

export class ComplementGroupNotFoundException extends NotFoundException {
  constructor() {
    super('Grupo de complementos não encontrado');
  }
}
