import { ExceptionCode } from "types/ExceptionCode"
import { lookupOrganisationUnitByThirdLevelPsaCode } from "phase1/dataLookup"
import findException from "phase1/lib/findException"
import isOrganisationUnitValid from "phase1/lib/isOrganisationUnitValid"
import type Exception from "phase1/types/Exception"
import type { ExceptionPath } from "phase1/types/Exception"
import type { ExceptionGenerator } from "phase1/types/ExceptionGenerator"

const COURT_HEARING_LOCATION_PATH: ExceptionPath =
  "AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode".split(".")

const COURT_HOUSE_CODE_PATH: ExceptionPath = "AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode".split(".")

const getResultPath = (offenceIndex: number, resultIndex: number): ExceptionPath => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "Result",
  resultIndex
]

const getResultNextResultSourceOrganisationPath = (offenceIndex: number, resultIndex: number): ExceptionPath =>
  getResultPath(offenceIndex, resultIndex).concat(["NextResultSourceOrganisation", "OrganisationUnitCode"])

//TODO: Move these validations into the zod schema validations
const HO100300: ExceptionGenerator = (hearingOutcome, options) => {
  const exceptions: Exception[] = options?.exceptions ?? []
  const { CourtHearingLocation } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const generatedExceptions: Exception[] = []

  const courtHearingLocationException = findException(exceptions, generatedExceptions, COURT_HEARING_LOCATION_PATH)

  // Validate Court Hearing Location
  const isCourtHearingLocationValid = CourtHearingLocation && isOrganisationUnitValid(CourtHearingLocation)
  if (!courtHearingLocationException && !isCourtHearingLocationValid) {
    generatedExceptions.push({ code: ExceptionCode.HO100300, path: COURT_HEARING_LOCATION_PATH })
  }

  if (!isCourtHearingLocationValid) {
    const courtHouseCode = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode
    const isCourtHouseCodeValid = !!lookupOrganisationUnitByThirdLevelPsaCode(courtHouseCode)
    if (!isCourtHouseCodeValid) {
      generatedExceptions.push({ code: ExceptionCode.HO100300, path: COURT_HOUSE_CODE_PATH })
    }
  }

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence, offenceIndex) =>
    offence.Result.forEach((result, resultIndex) => {
      const nextResultSourceOrganisationException = findException(
        exceptions!,
        generatedExceptions,
        getResultNextResultSourceOrganisationPath(offenceIndex, resultIndex)
      )
      if (
        !nextResultSourceOrganisationException &&
        result.NextResultSourceOrganisation &&
        !isOrganisationUnitValid(result.NextResultSourceOrganisation)
      ) {
        generatedExceptions.push({
          code: ExceptionCode.HO100300,
          path: getResultNextResultSourceOrganisationPath(offenceIndex, resultIndex)
        })
      }
    })
  )

  return generatedExceptions
}

export default HO100300
