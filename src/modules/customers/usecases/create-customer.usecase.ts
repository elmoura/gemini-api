import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CustomerDataSource } from '../datasources/customer.datasource';
import { CustomerObj } from './dtos/customer.object';
import { CreateCustomerInput } from './dtos/create-customer.input';

@Injectable()
export class CreateCustomerUseCase
  implements IBaseUseCase<CreateCustomerInput, CustomerObj>
{
  constructor(private readonly customerDataSource: CustomerDataSource) {}

  async execute(input: void): Promise<void> {}
}
