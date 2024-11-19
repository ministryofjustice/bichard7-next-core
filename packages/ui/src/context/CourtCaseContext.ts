import type { Dispatch, SetStateAction } from "react"
import type {
  Amender,
  AmendmentKeys,
  Amendments,
  OffenceField,
  ResultField,
  ResultQualifierCode
} from "types/Amendments"
import type { DisplayFullCourtCase } from "types/display/CourtCases"

import { createContext, useCallback, useContext, useState } from "react"
import getAmendmentsByComparison from "utils/getAmendmentsByComparison"

import parseCourtCaseWithDateObjects from "../utils/date/parseCourtCaseWithDateObjects"

export interface CourtCaseContextType {
  amendments: Amendments
  courtCase: DisplayFullCourtCase
  savedAmendments: Amendments
}

export interface CourtCaseContextResult {
  amend: Amender
  amendments: Amendments
  courtCase: DisplayFullCourtCase
  savedAmend: Amender
  savedAmendments: Amendments
  updateCourtCase: (courtCase: DisplayFullCourtCase) => void
}

type CourtCaseContextInput = [CourtCaseContextType, Dispatch<SetStateAction<CourtCaseContextType>>]

const upsertAmendments = <T extends Record<string, unknown>>(previousValues: T[], value: T): T[] => {
  const keys = Object.keys(value).filter((key) => key !== "value")
  const hasValue = (previousValue: T, newValue: T) =>
    keys.filter((key) => previousValue?.[key] === newValue[key]).length === keys.length
  const amendmentsWithoutOldValue = (previousValues || []).filter((previousValue) => !hasValue(previousValue, value))

  return [...amendmentsWithoutOldValue, value]
}

const updateAmendments = (
  key: AmendmentKeys,
  newValue:
    | boolean
    | OffenceField<number>
    | OffenceField<string>
    | ResultField<string>
    | ResultQualifierCode
    | string
    | undefined,
  previousAmendments: Amendments
): Amendments => {
  const value =
    typeof newValue === "object"
      ? upsertAmendments(previousAmendments[key] as Record<string, unknown>[], newValue)
      : newValue
  const newAmendments = { ...previousAmendments, [key]: value }

  return newAmendments
}

const CourtCaseContext = createContext<CourtCaseContextInput | null>(null)

const useCourtCase = (): CourtCaseContextResult => {
  const courtCaseContextState = useContext(CourtCaseContext)

  if (!courtCaseContextState) {
    throw new Error("courtCase has to be used within <CourtCaseContext.Provider>")
  }

  const [context, setContext] = courtCaseContextState

  const updateCourtCase = useCallback(
    (newCourtCase: DisplayFullCourtCase) => {
      setContext((previousContext) => {
        return { ...previousContext, courtCase: newCourtCase }
      })
    },
    [setContext]
  )

  const amend: Amender = useCallback(
    (key) => (newValue) => {
      setContext((previousContext) => {
        return { ...previousContext, amendments: updateAmendments(key, newValue, previousContext.amendments) }
      })
    },
    [setContext]
  )

  const savedAmend: Amender = useCallback(
    (key) => (newValue) => {
      setContext((previousContext) => {
        return { ...previousContext, savedAmendments: updateAmendments(key, newValue, previousContext.amendments) }
      })
    },
    [setContext]
  )

  return {
    amend,
    amendments: context.amendments,
    courtCase: parseCourtCaseWithDateObjects(context.courtCase),
    savedAmend,
    savedAmendments: context.savedAmendments,
    updateCourtCase
  }
}

const useCourtCaseContextState = (courtCase: DisplayFullCourtCase) =>
  useState<CourtCaseContextType>({
    amendments: getAmendmentsByComparison(courtCase.aho, courtCase.updatedHearingOutcome),
    courtCase,
    savedAmendments: getAmendmentsByComparison(courtCase.aho, courtCase.updatedHearingOutcome)
  })

CourtCaseContext.displayName = "CourtCaseContext"

export { CourtCaseContext, useCourtCase, useCourtCaseContextState }
