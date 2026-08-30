import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationRole } from '@modules/users/enums/organization-role';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() };
  const guard = new RolesGuard(reflector as unknown as Reflector);

  const buildContext = (userRoles?: OrganizationRole[]): ExecutionContext => {
    const req = { user: userRoles ? { roles: userRoles } : undefined };

    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getArgs: () => [{}, {}, { req }, {}],
      getType: () => 'graphql',
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('permite acesso quando o endpoint não exige nenhuma role', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(buildContext([OrganizationRole.WAITER]))).toBe(
      true,
    );
  });

  it('permite acesso quando o usuário possui a role exigida', () => {
    reflector.getAllAndOverride.mockReturnValue([OrganizationRole.ADMIN]);

    expect(
      guard.canActivate(
        buildContext([OrganizationRole.WAITER, OrganizationRole.ADMIN]),
      ),
    ).toBe(true);
  });

  it('bloqueia acesso quando o usuário não possui nenhuma das roles exigidas', () => {
    reflector.getAllAndOverride.mockReturnValue([OrganizationRole.ADMIN]);

    expect(guard.canActivate(buildContext([OrganizationRole.WAITER]))).toBe(
      false,
    );
  });

  it('bloqueia acesso quando request.user não possui roles', () => {
    reflector.getAllAndOverride.mockReturnValue([OrganizationRole.ADMIN]);

    expect(guard.canActivate(buildContext(undefined))).toBe(false);
  });
});
