import { ForbiddenException, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CustomerDataSource } from '../datasources/customer.datasource';
import { CustomerObj } from './dtos/customer.object';
import { CreateCustomerInput } from './dtos/create-customer.input';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { CustomerEmailAlreadyExistsException } from '../errors/customer-already-exists.exception';
import { CryptoService } from '@shared/services/crypto.service';

@Injectable()
export class CreateCustomerUseCase
  implements IBaseUseCase<CreateCustomerInput, CustomerObj>
{
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly customerDataSource: CustomerDataSource,
    private readonly organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute(input: CreateCustomerInput): Promise<CustomerObj> {
    const { organizationId, email } = input;

    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!organizationExists) throw new ForbiddenException();

    const customerEmailAlreadyExists =
      await this.customerDataSource.findByEmail(email);

    if (customerEmailAlreadyExists)
      throw new CustomerEmailAlreadyExistsException();

    const encryptedPassword = this.cryptoService.encrypt(input.password);

    const createdCustomer = await this.customerDataSource.createOne({
      ...input,
      password: encryptedPassword,
    });

    return createdCustomer;
  }
}
