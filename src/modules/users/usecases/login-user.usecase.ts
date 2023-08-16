import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CryptoService } from '@shared/services/crypto.service';
import {
  GenerateTokenPayload,
  TokenService,
} from '@modules/auth/services/token.service';
import { UserDataSource } from '../datasources/user.datasource';
import { LoginUserInput } from './dto/login-user.input';
import { LoginUserOutput } from './dto/login-user.output';

@Injectable()
export class LoginUserUseCase
  implements IBaseUseCase<LoginUserInput, LoginUserOutput>
{
  constructor(
    private tokenService: TokenService,
    private cryptoService: CryptoService,
    private userDataSource: UserDataSource,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userDataSource.findByEmail(input.email, {
      returnPassword: true,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid =
      this.cryptoService.encrypt(input.password) === user.password;

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const tokenPayload: Omit<GenerateTokenPayload, 'locationId'> = {
      userId: user._id,
      organizationId: user.organizationId,
    };

    const { accessToken } = this.tokenService.generate(tokenPayload);

    return {
      auth: { accessToken },
      ...user,
    };
  }
}
