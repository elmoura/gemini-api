import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrintClientType } from '../enums/print-client-type';

export type ClientSourceData = {
  sourceClientType: PrintClientType;
  sourceDeviceId?: string;
};

function isPrintClientType(value: unknown): value is PrintClientType {
  return (
    typeof value === 'string' &&
    (Object.values(PrintClientType) as string[]).includes(value)
  );
}

export const ClientSource = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ClientSourceData => {
    const request = GqlExecutionContext.create(context).getContext().req;
    const rawType = request.headers['x-client-type'];
    const normalizedType =
      typeof rawType === 'string' ? rawType.toUpperCase() : undefined;

    return {
      sourceClientType: isPrintClientType(normalizedType)
        ? normalizedType
        : PrintClientType.DESKTOP,
      sourceDeviceId: request.headers['x-client-device-id'] as
        | string
        | undefined,
    };
  },
);
