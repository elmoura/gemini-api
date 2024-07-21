import { BadRequestException } from '@nestjs/common';

export class TableOrderNotUpdated extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
