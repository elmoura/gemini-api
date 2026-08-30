import { ConflictException } from '@nestjs/common';

export class InvitationExpiredError extends ConflictException {
  constructor() {
    super('Esse convite expirou.');
  }
}
