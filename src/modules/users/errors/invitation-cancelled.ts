import { ConflictException } from '@nestjs/common';

export class InvitationCancelledError extends ConflictException {
  constructor() {
    super('Esse convite foi cancelado.');
  }
}
