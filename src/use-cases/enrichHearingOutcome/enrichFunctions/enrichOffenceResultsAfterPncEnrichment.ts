import getCourtDetails from "src/lib/getCourtDetails"
import { CROWN_COURT } from "src/lib/properties"
import type { AnnotatedHearingOutcome, OrganisationUnit, Result } from "src/types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import { lookupOrganisationUnitByCode, lookupOrganisationUnitByThirdLevelPsaCode } from "src/use-cases/dataLookup"
import populateOrganisationUnitFields from "src/use-cases/populateOrganisationUnitFields"
import isCaseRecordable from "../../../lib/isCaseRecordable"

const SUSPENDED_2ND_DURATION_RESULTS = [1115, 1134]
const SUSPENDED = "Suspended"
const RESULT_UNRESULTED = "Unresulted"
const RESULT_SENTENCE = "Sentence"
const RESULT_ADJOURNMENT_POST_JUDGEMENT = "Adjournment post Judgement"
const RESULT_ADJOURNMENT_WITH_JUDGEMENT = "Adjournment with Judgement"
const RESULT_JUDGEMENT_WITH_FINAL_RESULT = "Judgement with final result"
const RESULT_ADJOURNMENT_PRE_JUDGEMENT = "Adjournment pre Judgement"
const ADJOURNMENT_RANGES = [
  { start: 4001, end: 4009 },
  { start: 4011, end: 4017 },
  { start: 4020, end: 4021 },
  { start: 4023, end: 4025 },
  { start: 4027, end: 4035 },
  { start: 4046, end: 4048 },
  { start: 4050, end: 4050 },
  { start: 4051, end: 4051 },
  { start: 4053, end: 4058 },
  { start: 4506, end: 4506 },
  { start: 4508, end: 4508 },
  { start: 4541, end: 4572 },
  { start: 4574, end: 4574 },
  { start: 4587, end: 4589 }
]
const WARRANT_ISSUED_CODES = [{ start: 4575, end: 4577 }]
const ADJOURNMENT_NO_NEXT_HEARING_RANGES = [{ start: 0, end: 0 }]
const RESULT_CLASS_PLEAS = ["ADM"]
const RESULT_CLASS_VERDICTS = ["NG", "NC", "NA"]
const RESULT_CLASS_RESULT_CODES = [
  // eslint-disable-next-line prettier/prettier
  2050, 2063, 4010, 1016, 2053, 2060, 2065, 1029, 1030, 1044, 2006,
  // eslint-disable-next-line prettier/prettier
  3047, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 3109, 3110,
  // eslint-disable-next-line prettier/prettier
  3111, 3126, 3127, 3128, 3129, 3130, 3131, 3146, 3147, 3148, 3272
]
const NON_RECORDABLE_RESULT_CODES = [
  // eslint-disable-next-line prettier/prettier
  1000, 1505, 1509, 1510, 1511, 1513, 1514, 2069, 2501, 2505, 2507,
  // eslint-disable-next-line prettier/prettier
  2508, 2509, 2511, 2514, 3501, 3502, 3503, 3504, 3508, 3509, 3510,
  // eslint-disable-next-line prettier/prettier
  3512, 3514, 4049, 4505, 4507, 4509, 4510, 4532, 4534, 4544, 4584,
  // eslint-disable-next-line prettier/prettier
  4585, 4586, 3118, 4592, 4593, 4594, 4595, 4596, 4597
]
type NumberRange = { start: number; end: number }

const isInRanges = (ranges: NumberRange[], value: number) =>
  ranges.some((adjournmentRange) => value >= adjournmentRange.start && value <= adjournmentRange.end)

const populateSourceOrganisation = (result: Result, hearingOutcome: AnnotatedHearingOutcome) => {
  const { CourtHearingLocation, CourtHouseCode } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing

  if (result.SourceOrganisation) {
    populateOrganisationUnitFields(result.SourceOrganisation)
  }

  if (!result.SourceOrganisation.OrganisationUnitCode && CourtHearingLocation) {
    result.SourceOrganisation = { ...CourtHearingLocation }
  }

  if (!result.SourceOrganisation && CourtHouseCode) {
    const organisationUnitData = lookupOrganisationUnitByThirdLevelPsaCode(CourtHouseCode)
    if (organisationUnitData) {
      const { topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode } = organisationUnitData
      result.SourceOrganisation = {
        TopLevelCode: topLevelCode,
        SecondLevelCode: secondLevelCode,
        ThirdLevelCode: thirdLevelCode,
        BottomLevelCode: bottomLevelCode,
        OrganisationUnitCode: [topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode].filter((x) => x).join()
      }
    }
  }

  populateOrganisationUnitFields(result.SourceOrganisation)
}

const populateCourt = (result: Result, hearingOutcome: AnnotatedHearingOutcome) => {
  populateSourceOrganisation(result, hearingOutcome)

  const sourceOrganisationUnitData = lookupOrganisationUnitByCode(result.SourceOrganisation)
  result.CourtType = sourceOrganisationUnitData ? getCourtDetails(sourceOrganisationUnitData).courtType : undefined

  result.NextCourtType = undefined
  if (result.NextResultSourceOrganisation) {
    populateOrganisationUnitFields(result.NextResultSourceOrganisation)

    if (result.NextResultSourceOrganisation.OrganisationUnitCode || result.NextHearingDate) {
      const nextResultSourceOrganisationUnitData = lookupOrganisationUnitByCode(result.NextResultSourceOrganisation)
      if (nextResultSourceOrganisationUnitData) {
        result.NextCourtType = getCourtDetails(nextResultSourceOrganisationUnitData).courtType
      }
    }
  }
}

const enruchResult = (
  result: Result,
  convictionDate: Date | undefined,
  dateOfHearing: Date,
  courtType: string | undefined,
  addedByTheCourt: boolean
) => {
  const nextHearingPresent = !!result.NextResultSourceOrganisation?.OrganisationUnitCode
  if (courtType === CROWN_COURT) {
    return
  }
  const adjourned = result.CJSresultCode ? isInRanges(ADJOURNMENT_RANGES, result.CJSresultCode) : false
  const warrantIssued = result.CJSresultCode ? isInRanges(WARRANT_ISSUED_CODES, result.CJSresultCode) : false
  const adjournedNoNextHearingDetails = result.CJSresultCode
    ? isInRanges(ADJOURNMENT_NO_NEXT_HEARING_RANGES, result.CJSresultCode)
    : false
  const adjournment = nextHearingPresent || adjourned || warrantIssued || adjournedNoNextHearingDetails

  if (adjourned && !nextHearingPresent) {
    result.NextResultSourceOrganisation = {} as OrganisationUnit
  }

  const { Verdict, PleaStatus, CJSresultCode } = result

  let resultClass = RESULT_UNRESULTED
  if (convictionDate && dateOfHearing && convictionDate < dateOfHearing) {
    resultClass = adjournment ? RESULT_ADJOURNMENT_POST_JUDGEMENT : RESULT_SENTENCE
  } else if (convictionDate && dateOfHearing && convictionDate === dateOfHearing) {
    resultClass = adjournment ? RESULT_ADJOURNMENT_WITH_JUDGEMENT : RESULT_JUDGEMENT_WITH_FINAL_RESULT
  } else if (RESULT_CLASS_PLEAS.includes(PleaStatus?.toString() ?? "") && !adjournment) {
    resultClass = RESULT_JUDGEMENT_WITH_FINAL_RESULT
  } else if (RESULT_CLASS_RESULT_CODES.includes(CJSresultCode ?? 0) || RESULT_CLASS_VERDICTS.includes(Verdict ?? "")) {
    resultClass = adjournment ? RESULT_UNRESULTED : RESULT_JUDGEMENT_WITH_FINAL_RESULT
  } else if (!Verdict && adjournment) {
    resultClass = RESULT_ADJOURNMENT_PRE_JUDGEMENT
  } else if (NON_RECORDABLE_RESULT_CODES.includes(CJSresultCode ?? 0) || addedByTheCourt) {
    resultClass = RESULT_UNRESULTED
  } else {
    resultClass = RESULT_UNRESULTED
  }

  result.ResultClass = resultClass
}

const enrichOffenceResults: EnrichAhoFunction = (hearingOutcome) => {
  const { DateOfHearing, CourtType } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence) => {
    const additionalResults: Result[] = []

    offence.Result.forEach((result) => {
      result.ResultApplicableQualifierCode = []

      // enrich Result
      result.ResultHearingDate = offence.ConvictionDate ?? DateOfHearing
      if (
        result.CJSresultCode &&
        result.Duration &&
        result.Duration.length > 1 &&
        SUSPENDED_2ND_DURATION_RESULTS.includes(result.CJSresultCode)
      ) {
        result.Duration[1].DurationType = SUSPENDED
      }

      populateCourt(result, hearingOutcome)

      if (isCaseRecordable(hearingOutcome)) {
        enruchResult(result, offence.ConvictionDate, DateOfHearing, CourtType, !!offence.AddedByTheCourt)
        // const additionalResult = enrich(hearingOutcome, result)
      }
    })

    offence.Result = offence.Result.concat(additionalResults)
  })

  return hearingOutcome
}

export default enrichOffenceResults
