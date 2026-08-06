import { ConflictException } from '@nestjs/common';

export class LocationShiftAlreadyOpenException extends ConflictException {
  constructor() {
    super('Já existe turno aberto nesta unidade');
  }
}
