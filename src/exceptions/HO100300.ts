import { lookupOrganisationUnitByCode } from "src/dataLookup"
import convertAsnToOrganisationUnit from "src/lib/convertAsnToOrganisationUnit"
import errorPaths from "src/lib/errorPaths"
import findException from "src/lib/findException"
import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import type { ExceptionPath } from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import populateOrganisationUnitFields from "src/use-cases/populateOrganisationUnitFields"

const COURT_HEARING_LOCATION_PATH: ExceptionPath =
  "AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode".split(".")

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

const isOrganisationUnitValid = (organisationUnit?: OrganisationUnitCodes): boolean =>
  !!organisationUnit && !!lookupOrganisationUnitByCode(populateOrganisationUnitFields(organisationUnit))

const isAsnValid = (asn?: string): boolean => !!asn && isOrganisationUnitValid(convertAsnToOrganisationUnit(asn))

const HO100300: ExceptionGenerator = (hearingOutcome, options) => {
  const exceptions: Exception[] = options?.exceptions ?? []
  const { ArrestSummonsNumber } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const { CourtHearingLocation } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const generatedExceptions: Exception[] = []

  // Validate ASN
  const arrestSummonsNumberException = findException(exceptions, generatedExceptions, errorPaths.case.asn)
  if (!arrestSummonsNumberException && ArrestSummonsNumber && !isAsnValid(ArrestSummonsNumber)) {
    generatedExceptions.push({ code: ExceptionCode.HO100300, path: errorPaths.case.asn })
  }

  const courtHearingLocationException = findException(exceptions!, generatedExceptions, COURT_HEARING_LOCATION_PATH)

  // Validate Court Hearing Location
  const isCourtHearingLocationValid = CourtHearingLocation && isOrganisationUnitValid(CourtHearingLocation)
  if (!courtHearingLocationException && !isCourtHearingLocationValid) {
    generatedExceptions.push({ code: ExceptionCode.HO100300, path: COURT_HEARING_LOCATION_PATH })
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
