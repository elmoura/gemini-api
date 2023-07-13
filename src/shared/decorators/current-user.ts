import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenData } from '@modules/auth/services/token.service';

export class CurrentUserData implements TokenData {
  userId: string;
  organizationId: string;
  exp?: number;
  iat?: number;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUserData => {
    const request = GqlExecutionContext.create(context).getContext().req;
    return request.user;
  },
);
