import { ConflictException } from '@nestjs/common';

export class InvitationAlreadyUsedError extends ConflictException {
  constructor() {
    super('Esse convite já foi utilizado.');
  }
}
