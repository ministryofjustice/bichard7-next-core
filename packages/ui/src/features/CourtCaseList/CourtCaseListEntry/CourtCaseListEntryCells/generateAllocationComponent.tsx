import Permission from "@moj-bichard7/common/types/Permission"
import { ReactNode } from "react"

import { FORCES_WITH_ALLOCATION_ENABLED } from "@/config"
import { DisplayFullUser } from "@/types/display/Users"
import { DisplayPartialCourtCase } from "@/types/display/CourtCases"
import { AllocateUser } from "../../tags/Allocate/AllocateUser"

export type ColumnType = "exceptions" | "triggers"

export const generateAllocationComponent = (
  currentUser: DisplayFullUser,
  columnType: ColumnType,
  courtCase: DisplayPartialCourtCase
): ReactNode | null => {
  if (!currentUser.hasAccessTo[Permission.CanAllocate]) {
    return null
  }

  if (!currentUser.visibleForces.some((force) => FORCES_WITH_ALLOCATION_ENABLED.has(force))) {
    return null
  }

  return <AllocateUser columnType={columnType} caseId={courtCase.errorId} />
}
