import { UnprocessableEntityException } from '@nestjs/common';

export class NoOpenLocationShiftException extends UnprocessableEntityException {
  constructor() {
    super('Não há turno aberto para operar');
  }
}
