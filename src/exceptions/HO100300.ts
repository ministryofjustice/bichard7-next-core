import convertAsnToOrganisationUnit from "src/lib/convertAsnToOrganisationUnit"
import type { OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import { lookupOrganisationUnitByCode } from "src/use-cases/dataLookup"
import populateOrganisationUnitFields from "src/use-cases/populateOrganisationUnitFields"

type FieldPath = (string | number)[]

const ARREST_SOMMONS_NUMBER_PATH: FieldPath =
  "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber".split(".")
const COURT_HEARING_LOCATION_PATH: FieldPath =
  "AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode".split(".")

const getResultPath = (offenceIndex: number, resultIndex: number): FieldPath => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "Result",
  resultIndex
]

const getResultNextResultSourceOrganisationPath = (offenceIndex: number, resultIndex: number): FieldPath =>
  getResultPath(offenceIndex, resultIndex).concat(["NextResultSourceOrganisation", "OrganisationUnitCode"])

const findException = (
  exceptions: Exception[],
  generatedExceptions: Exception[],
  path: FieldPath,
  exceptionCode?: string
) => {
  const pathString = JSON.stringify(path)
  const condition = (exception: Exception) =>
    JSON.stringify(exception.path) === pathString && (!exceptionCode || exception.code === exceptionCode)
  return exceptions.find(condition) ?? generatedExceptions.find(condition)
}

const isOrganisationUnitValid = (organisationUnit?: OrganisationUnit): boolean =>
  !!organisationUnit && !!lookupOrganisationUnitByCode(populateOrganisationUnitFields(organisationUnit))

const isAsnValid = (asn?: string): boolean => !!asn && isOrganisationUnitValid(convertAsnToOrganisationUnit(asn))

const HO100300: ExceptionGenerator = (hearingOutcome, options) => {
  const { exceptions } = options!
  const { ArrestSummonsNumber } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const { CourtHearingLocation } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const generatedExceptions: Exception[] = []

  // Validate ASN
  const arrestSummonsNumberException = findException(exceptions!, generatedExceptions, ARREST_SOMMONS_NUMBER_PATH)
  if (!arrestSummonsNumberException && ArrestSummonsNumber && !isAsnValid(ArrestSummonsNumber)) {
    generatedExceptions.push({ code: ExceptionCode.HO100300, path: ARREST_SOMMONS_NUMBER_PATH })
  }

  // Validate Court Hearing Location
  const isCourtHearingLocationValid = CourtHearingLocation && isOrganisationUnitValid(CourtHearingLocation)
  if (!isCourtHearingLocationValid) {
    generatedExceptions.push({ code: ExceptionCode.HO100300, path: COURT_HEARING_LOCATION_PATH })
  }

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence, offenceIndex) =>
    offence.Result.forEach((result, resultIndex) => {
      if (result.NextResultSourceOrganisation && !isOrganisationUnitValid(result.NextResultSourceOrganisation)) {
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
