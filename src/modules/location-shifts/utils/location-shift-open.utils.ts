import { LocationShift } from '../entities/location-shift';
import { LocationShiftStatuses } from '../enums/location-shift-statuses';

export function isLocationShiftOpen(shift: LocationShift): boolean {
  return (
    shift.status === LocationShiftStatuses.OPEN ||
    (shift.startedAt != null && shift.finishedAt == null)
  );
}

export function buildOpenLocationShiftFilter(
  organizationId: string,
  locationId: string,
) {
  return {
    organizationId,
    locationId,
    $or: [
      { status: LocationShiftStatuses.OPEN },
      { startedAt: { $ne: null }, finishedAt: null },
    ],
  };
}
