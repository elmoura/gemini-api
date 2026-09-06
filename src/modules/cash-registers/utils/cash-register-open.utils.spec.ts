import { CashRegister, CashRegisterStatus } from '../entities/cash-register';
import {
  buildOpenCashRegisterFilter,
  isCashRegisterOpen,
} from './cash-register-open.utils';

const buildCashRegister = (overrides: Partial<CashRegister>): CashRegister =>
  ({
    _id: 'cash-register-id',
    organizationId: 'org-id',
    locationId: 'location-id',
    status: CashRegisterStatus.OPEN,
    openedByUserId: 'user-id',
    openingAmount: 100,
    startedAt: new Date('2026-08-31T10:00:00.000Z'),
    finishedAt: null,
    createdAt: new Date('2026-08-31T10:00:00.000Z'),
    updatedAt: new Date('2026-08-31T10:00:00.000Z'),
    ...overrides,
  } as CashRegister);

describe('isCashRegisterOpen', () => {
  it('retorna true quando status é OPEN e finishedAt é null', () => {
    expect(
      isCashRegisterOpen(
        buildCashRegister({
          status: CashRegisterStatus.OPEN,
          finishedAt: null,
        }),
      ),
    ).toBe(true);
  });

  it('retorna false quando status é CLOSED e finishedAt está preenchido', () => {
    expect(
      isCashRegisterOpen(
        buildCashRegister({
          status: CashRegisterStatus.CLOSED,
          finishedAt: new Date('2026-08-31T22:00:00.000Z'),
        }),
      ),
    ).toBe(false);
  });

  it('retorna true defensivamente quando startedAt existe e finishedAt é null', () => {
    expect(
      isCashRegisterOpen(
        buildCashRegister({
          status: CashRegisterStatus.CLOSED,
          startedAt: new Date('2026-08-31T10:00:00.000Z'),
          finishedAt: null,
        }),
      ),
    ).toBe(true);
  });
});

describe('buildOpenCashRegisterFilter', () => {
  it('monta o filtro Mongo para caixa aberto por org e unidade', () => {
    expect(buildOpenCashRegisterFilter('org-id', 'location-id')).toEqual({
      organizationId: 'org-id',
      locationId: 'location-id',
      $or: [
        { status: CashRegisterStatus.OPEN },
        { startedAt: { $ne: null }, finishedAt: null },
      ],
    });
  });
});
