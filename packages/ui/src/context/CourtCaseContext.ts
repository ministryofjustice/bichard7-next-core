import { createContext, Dispatch, SetStateAction, useCallback, useContext, useState } from "react"
import { Amender, AmendmentKeys, Amendments, OffenceField, ResultField, ResultQualifierCode } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import getAmendmentsByComparison from "utils/getAmendmentsByComparison"
import parseCourtCaseWithDateObjects from "../utils/date/parseCourtCaseWithDateObjects"

export interface CourtCaseContextType {
  courtCase: DisplayFullCourtCase
  amendments: Amendments
  savedAmendments: Amendments
}

export interface CourtCaseContextResult {
  courtCase: DisplayFullCourtCase
  amendments: Amendments
  savedAmendments: Amendments
  amend: Amender
  savedAmend: Amender
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
    | string
    | boolean
    | OffenceField<number>
    | OffenceField<string>
    | ResultQualifierCode
    | ResultField<string>
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
    courtCase: parseCourtCaseWithDateObjects(context.courtCase),
    amendments: context.amendments,
    savedAmendments: context.savedAmendments,
    amend,
    savedAmend,
    updateCourtCase
  }
}

const useCourtCaseContextState = (courtCase: DisplayFullCourtCase) =>
  useState<CourtCaseContextType>({
    courtCase,
    amendments: getAmendmentsByComparison(courtCase.aho, courtCase.updatedHearingOutcome),
    savedAmendments: getAmendmentsByComparison(courtCase.aho, courtCase.updatedHearingOutcome)
  })

CourtCaseContext.displayName = "CourtCaseContext"

export { CourtCaseContext, useCourtCase, useCourtCaseContextState }
