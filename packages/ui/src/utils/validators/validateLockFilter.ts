import lockedFilters from "utils/lockedFilters"

import { validateQueryParams } from "./validateQueryParams"

export const validateLockFilter = (lockFilter: string | string[] | undefined): boolean =>
  validateQueryParams(lockFilter) && lockedFilters.includes(lockFilter)

export const mapLockFilter = (lockFilter: string | string[] | undefined): boolean | undefined =>
  validateLockFilter(lockFilter) ? lockFilter === "Locked" : undefined
