import { NotFoundException } from '@nestjs/common';

export class LocationShiftNotFoundException extends NotFoundException {
  constructor() {
    super('Turno não encontrado');
  }
}
