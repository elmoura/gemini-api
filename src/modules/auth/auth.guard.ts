import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenService } from '@modules/auth/services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = GqlExecutionContext.create(context).getContext().req;

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const isTokenValid = this.tokenService.isTokenValid(token);

    if (!isTokenValid) {
      throw new UnauthorizedException();
    }

    request.user = this.tokenService.decode(token);

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
