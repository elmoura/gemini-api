import { ForbiddenException } from '@nestjs/common';

export class CustomerEmailAlreadyExistsException extends ForbiddenException {
  constructor() {
    super('poxa, já existe um usuário com esse e-mail :(');
  }
}
