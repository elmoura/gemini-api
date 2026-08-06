import { BadRequestException } from '@nestjs/common';

export class InvalidComplementGroupConfigException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
