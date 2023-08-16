import { Injectable, BadRequestException } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { GetUserOutput } from './dto/get-user.output';
import { UserDataSource } from '@modules/users/datasources/user.datasource';

interface GetUserInput {
  userId: string;
}

@Injectable()
export class GetUserUseCase
  implements IBaseUseCase<GetUserInput, GetUserOutput>
{
  constructor(private userDataSource: UserDataSource) {}

  async execute({ userId }: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userDataSource.findById(userId);

    if (!user) {
      throw new BadRequestException('Esse usuário não existe :(');
    }

    return user;
  }
}
