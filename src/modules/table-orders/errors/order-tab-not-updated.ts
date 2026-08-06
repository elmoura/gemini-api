import { BadRequestException } from '@nestjs/common';

export class OrderTabNotUpdated extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
