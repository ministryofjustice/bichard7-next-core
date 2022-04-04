import convertAsnToOrganisationUnit from "src/lib/convertAsnToOrganisationUnit"
import type { OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import { lookupOrganisationUnitByCode } from "src/use-cases/dataLookup"
import populateOrganisationUnitFields from "src/use-cases/populateOrganisationUnitFields"

const ARREST_SOMMONS_NUMBER_PATH =
  "AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber".split(".")
const COURT_HEARING_LOCATION_PATH =
  "AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode".split(".")

const getResultPath = (offenceIndex: number, resultIndex: number) =>
  `AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.${offenceIndex}.Result.${resultIndex}`.split(
    "."
  )

const getResultCourtTypePath = (offenceIndex: number, resultIndex: number): string[] =>
  getResultPath(offenceIndex, resultIndex).concat(["CourtType"])

const findException = (
  exceptions: Exception[],
  generatedExceptions: Exception[],
  path: string[],
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
  const { CourtHearingLocation, CourtHouseCode } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const generatedExceptions: Exception[] = []

  // Validate ASN
  const arrestSummonsNumberException = findException(exceptions!, generatedExceptions, ARREST_SOMMONS_NUMBER_PATH)
  if (!arrestSummonsNumberException && ArrestSummonsNumber && !isAsnValid(ArrestSummonsNumber)) {
    generatedExceptions.push({ code: ExceptionCode.HO100300, path: ARREST_SOMMONS_NUMBER_PATH })
  }

  // Validate Court Hearing Location
  const isCourtHearingLocationValid = CourtHearingLocation && isOrganisationUnitValid(CourtHearingLocation)
  if (!isCourtHearingLocationValid && !CourtHouseCode) {
    generatedExceptions.push({ code: ExceptionCode.HO100300, path: COURT_HEARING_LOCATION_PATH })
  }

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence, offenceIndex) =>
    offence.Result.forEach((result, resultIndex) => {
      // Validate Court Type
      if (
        result.SourceOrganisation &&
        !lookupOrganisationUnitByCode(result.SourceOrganisation) &&
        !CourtHearingLocation &&
        !findException(exceptions!, generatedExceptions, COURT_HEARING_LOCATION_PATH, ExceptionCode.HO100300)
      ) {
        generatedExceptions.push({
          code: ExceptionCode.HO100300,
          path: getResultCourtTypePath(offenceIndex, resultIndex)
        })
      }
    })
  )

  return generatedExceptions
}

export default HO100300
