import type { CaseDetailsTab } from "./CaseDetailsTab"

export type TabDetails = {
  name: CaseDetailsTab
  exceptionsCount: number
  exceptionsResolved: boolean
}

export type ExceptionDetails = {
  ExceptionsCount: number
  ExceptionsResolved: boolean
}
