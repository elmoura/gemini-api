import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OrganizationRole } from '@modules/users/enums/organization-role';
import { ROLES_KEY } from '@shared/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<OrganizationRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = GqlExecutionContext.create(context).getContext().req;
    const userRoles: OrganizationRole[] = request.user?.roles ?? [];

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
