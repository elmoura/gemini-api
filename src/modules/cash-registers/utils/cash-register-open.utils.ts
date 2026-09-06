import { CashRegister, CashRegisterStatus } from '../entities/cash-register';

export function isCashRegisterOpen(cashRegister: CashRegister): boolean {
  return (
    cashRegister.status === CashRegisterStatus.OPEN ||
    (cashRegister.startedAt != null && cashRegister.finishedAt == null)
  );
}

export function buildOpenCashRegisterFilter(
  organizationId: string,
  locationId: string,
) {
  return {
    organizationId,
    locationId,
    $or: [
      { status: CashRegisterStatus.OPEN },
      { startedAt: { $ne: null }, finishedAt: null },
    ],
  };
}
