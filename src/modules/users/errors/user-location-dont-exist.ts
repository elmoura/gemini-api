import { BadRequestException } from '@nestjs/common';

export class UserLocationDontExistException extends BadRequestException {
  constructor() {
    super('a localização informada não existe.');
  }
}
