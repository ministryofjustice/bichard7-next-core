import type { Duration, Result } from "../../../types/AnnotatedHearingOutcome"
import type {
  ResultedCaseMessageParsedXml,
  SpiNextHearingDetails,
  SpiOffence,
  SpiResult
} from "../../../types/SpiResult"

import countDecimalPlaces from "../../countDecimalPlaces"
import {
  lookupModeOfTrialReasonBySpiCode,
  lookupOrganisationUnitByThirdLevelPsaCode,
  lookupPleaStatusBySpiCode,
  lookupRemandStatusBySpiCode,
  lookupVerdictBySpiCode
} from "../../dataLookup"
import extractCodesFromOU from "../../dataLookup/extractCodesFromOU"
import getOrganisationUnit from "../../getOrganisationUnit"
import getRemandDetailsFromResultText from "./getRemandDetailsFromResultText"
import lookupAmountTypeByCjsCode from "./lookupAmountTypeByCjsCode"

const freeTextResultCode = 1000
const otherValue = "OTHER"
const warrantIssueDateResultCodes = [4505, 4575, 4576, 4577, 4585, 4586]
const offencesTicRegex = /(\d+) other offences admitted and taken into consideration/i
const libraMaxQualifiers = 4
const libraElectronicTaggingText = "to be electronically monitored"
const taggingFixAdd = 3105
const taggingFixRemove = [1115, 1116, 1141, 1142, 1143]
const bailQualifierCode = "BA"
const durationTypes = {
  DURATION: "Duration"
}
const durationUnits = {
  SESSIONS: "S",
  HOURS: "H"
}
const resultPenaltyPoints = 3008
const resultCurfew1 = 1052
const resultCurfew2 = 3105

export interface OffenceResultsResult {
  bailQualifiers: string[]
  results: Result[]
}

const createDuration = (durationUnit: string, durationValue: number): Duration => ({
  DurationType: durationTypes.DURATION,
  DurationUnit: !durationUnit || durationUnit === "." ? durationUnits.SESSIONS : durationUnit,
  DurationLength: durationValue
})

const populateNextHearingDetails = (result: Result, nextHearingDetails: SpiNextHearingDetails): void => {
  result.NextHearingDate = nextHearingDetails.DateOfHearing ? new Date(nextHearingDetails.DateOfHearing) : undefined
  result.NextHearingTime = nextHearingDetails.TimeOfHearing
  // TODO: Currently Bichard looks this up by Third Level PSA code, but the data we receive is actully an org unit code
  if (nextHearingDetails.CourtHearingLocation !== undefined) {
    const codeNeedsPadding =
      nextHearingDetails.CourtHearingLocation.length > 0 && nextHearingDetails.CourtHearingLocation.length < 4
    const paddedCode = codeNeedsPadding
      ? nextHearingDetails.CourtHearingLocation.padEnd(4, "0")
      : nextHearingDetails.CourtHearingLocation
    const ou = lookupOrganisationUnitByThirdLevelPsaCode(paddedCode)
    if (ou) {
      result.NextResultSourceOrganisation = extractCodesFromOU(ou)
    }
  }
}

type PopulateResultOutput = {
  baResultCodeQualifierExcluded: boolean
  result: Result
}

const populateResult = (
  spiResult: SpiResult,
  courtResult: ResultedCaseMessageParsedXml,
  spiOffence: SpiOffence,
  bailQualifiers: Set<string>,
  baResultCodeQualifierExcluded: boolean
): PopulateResultOutput => {
  const {
    Session: {
      Case: {
        Defendant: { CourtIndividualDefendant: spiCourtIndividualDefendant }
      },
      CourtHearing: {
        Hearing: { DateOfHearing: spiDateOfHearing }
      }
    }
  } = courtResult
  const { ConvictingCourt: spiConvictingCourt, ConvictionDate: spiConvictionDate } = spiOffence
  const {
    ResultCode: spiResultCode,
    NextHearing: spiNextHearing,
    ResultCodeQualifier: spiResultCodeQualifier,
    Outcome: spiOutcome
  } = spiResult
  const spiResultCodeNumber = spiResultCode ? Number(spiResultCode) : freeTextResultCode

  const result: Result = {
    CJSresultCode: spiResultCodeNumber,
    ConvictingCourt: spiConvictingCourt,
    ResultHearingType: otherValue,
    ResultHearingDate: new Date(spiConvictionDate ?? spiDateOfHearing),
    SourceOrganisation: getOrganisationUnit(courtResult.Session.CourtHearing.Hearing.CourtHearingLocation),
    ResultQualifierVariable: []
  }

  if (spiNextHearing?.BailStatusOffence) {
    result.OffenceRemandStatus =
      lookupRemandStatusBySpiCode(spiNextHearing.BailStatusOffence)?.cjsCode ?? spiNextHearing.BailStatusOffence
  }

  if (typeof spiCourtIndividualDefendant?.ReasonForBailConditionsOrCustody === "string") {
    result.ReasonForOffenceBailConditions = spiCourtIndividualDefendant.ReasonForBailConditionsOrCustody
  }

  if (spiNextHearing && spiNextHearing.NextHearingDetails) {
    populateNextHearingDetails(result, spiNextHearing.NextHearingDetails)
  }

  if (spiOutcome) {
    const {
      Duration: spiDuration,
      ResultAmountSterling: spiResultAmountSterling,
      PenaltyPoints: spiPenaltyPoints
    } = spiOutcome
    result.Duration = result.Duration ?? []
    if (spiDuration) {
      const {
        DurationUnit: spiDurationUnit,
        DurationValue: spiDurationValue,
        SecondaryDurationValue: spiSecondaryDurationValue,
        SecondaryDurationUnit: spiSecondaryDurationUnit,
        DurationStartDate: spiDurationStartDate,
        DurationEndDate: spiDurationEndDate
      } = spiDuration
      if (spiDurationUnit && spiDurationValue !== undefined) {
        result.Duration.push(createDuration(spiDurationUnit, Number(spiDurationValue)))
      }

      if (spiSecondaryDurationUnit && spiSecondaryDurationValue !== undefined) {
        result.Duration.push(createDuration(spiSecondaryDurationUnit, Number(spiSecondaryDurationValue)))
      }

      result.DateSpecifiedInResult = result.DateSpecifiedInResult ?? []
      spiDurationStartDate.forEach((durationStartDate) => {
        result.DateSpecifiedInResult?.push({ Date: new Date(durationStartDate), Sequence: 1 })
      })
      spiDurationEndDate.forEach((durationEndDate) => {
        result.DateSpecifiedInResult?.push({ Date: new Date(durationEndDate), Sequence: 2 })
      })
    }

    if (spiResultAmountSterling) {
      result.AmountSpecifiedInResult = result.AmountSpecifiedInResult ?? []
      const amountType = lookupAmountTypeByCjsCode(result.CJSresultCode)
      result.AmountSpecifiedInResult.push({
        Amount: Number(spiResultAmountSterling),
        DecimalPlaces: countDecimalPlaces(spiResultAmountSterling),
        Type: amountType
      })
    }

    if (spiResultCode) {
      const resultCode = Number(spiResultCode)
      result.NumberSpecifiedInResult = result.NumberSpecifiedInResult ?? []
      if (resultCode === resultPenaltyPoints && spiPenaltyPoints) {
        result.NumberSpecifiedInResult.push({ Number: Number(spiPenaltyPoints), Type: "P" })
      } else if (
        (resultCode === resultCurfew1 || resultCode === resultCurfew2) &&
        spiDuration?.SecondaryDurationUnit === durationUnits.HOURS &&
        spiDuration?.SecondaryDurationValue
      ) {
        result.NumberSpecifiedInResult.push({ Number: Number(spiDuration.SecondaryDurationValue), Type: "P" })
      }
    }
  }

  if (spiNextHearing) {
    const {
      NextHearingDetails: {
        CourtHearingLocation: spiNextCourtHearingLocation,
        DateOfHearing: spiNextDateOfHearing,
        TimeOfHearing: spiNextTimeOfHearing
      }
    } = spiNextHearing
    if (spiNextCourtHearingLocation) {
      result.NextResultSourceOrganisation = {
        OrganisationUnitCode:
          lookupOrganisationUnitByThirdLevelPsaCode(spiNextCourtHearingLocation)?.thirdLevelCode ??
          spiNextCourtHearingLocation,
        SecondLevelCode: null,
        ThirdLevelCode: null,
        BottomLevelCode: null
      }

      result.NextHearingDate = new Date(spiNextDateOfHearing)
      result.NextHearingTime = spiNextTimeOfHearing
    }
  }

  if (spiOffence.Plea) {
    result.PleaStatus = lookupPleaStatusBySpiCode(spiOffence.Plea)?.cjsCode ?? spiOffence.Plea
  }

  if (spiOffence.Finding) {
    result.Verdict = lookupVerdictBySpiCode(spiOffence.Finding)?.cjsCode ?? spiOffence.Finding
  }

  if (spiOffence.ModeOfTrial !== undefined) {
    const modeOfTrial = Number(spiOffence.ModeOfTrial).toString()
    result.ModeOfTrialReason = lookupModeOfTrialReasonBySpiCode(modeOfTrial)?.cjsCode ?? modeOfTrial
  }

  if (spiResult.ResultText?.length > 0) {
    result.ResultVariableText = spiResult.ResultText
  }

  if (warrantIssueDateResultCodes.includes(spiResultCodeNumber)) {
    result.WarrantIssueDate = new Date(spiDateOfHearing)
  }

  const offencesTicMatch = spiResult.ResultText.match(offencesTicRegex)
  if (offencesTicMatch) {
    result.NumberOfOffencesTIC = Number(offencesTicMatch[1])
  }

  if (
    spiResultCodeQualifier.length === libraMaxQualifiers &&
    !spiResultCodeQualifier.some((resultCodeQualifier) => /BA/i.test(resultCodeQualifier)) &&
    spiResult.ResultText.toLowerCase().includes(libraElectronicTaggingText.toLowerCase())
  ) {
    if (taggingFixRemove.includes(spiResultCodeNumber)) {
      baResultCodeQualifierExcluded = true
    } else {
      bailQualifiers.add(bailQualifierCode)
    }
  }

  spiResultCodeQualifier.forEach((resultCodeQualifier) => {
    if (/BA/i.test(resultCodeQualifier) && taggingFixRemove.includes(spiResultCodeNumber)) {
      baResultCodeQualifierExcluded = true
    } else {
      if (resultCodeQualifier === bailQualifierCode) {
        bailQualifiers.add(bailQualifierCode)
      }

      result.ResultQualifierVariable?.push({ Code: resultCodeQualifier })
    }
  })

  if (!result.NextResultSourceOrganisation || !result.NextHearingDate) {
    const remandDetails = getRemandDetailsFromResultText(result)
    if (remandDetails.location && !result.NextResultSourceOrganisation) {
      result.NextResultSourceOrganisation = remandDetails.location
    }

    if (!result.NextHearingDate && remandDetails.date) {
      result.NextHearingDate = remandDetails.date
    }
  }

  return { result, baResultCodeQualifierExcluded }
}

const addBailResultQualifierVariable = (results: Result[]): boolean => {
  let baQualifierAdded = false
  results.forEach((result) => {
    if (
      result.CJSresultCode === taggingFixAdd &&
      !result.ResultQualifierVariable.some((r) => r.Code === bailQualifierCode)
    ) {
      result.ResultQualifierVariable.push({ Code: bailQualifierCode })
      baQualifierAdded = true
    }
  })
  return baQualifierAdded
}

const populateOffenceResults = (
  spiOffence: SpiOffence,
  courtResult: ResultedCaseMessageParsedXml
): OffenceResultsResult => {
  let baResultCodeQualifierHasBeenExcluded = false

  const bailQualifiers = new Set<string>()

  const { Result: spiResults } = spiOffence

  const results: Result[] = []

  for (const spiResult of spiResults) {
    const { result, baResultCodeQualifierExcluded } = populateResult(
      spiResult,
      courtResult,
      spiOffence,
      bailQualifiers,
      baResultCodeQualifierHasBeenExcluded
    )
    results.push(result)
    baResultCodeQualifierHasBeenExcluded ||= baResultCodeQualifierExcluded
  }

  if (baResultCodeQualifierHasBeenExcluded) {
    if (addBailResultQualifierVariable(results)) {
      bailQualifiers.add(bailQualifierCode)
    }
  }

  return { results, bailQualifiers: Array.from(bailQualifiers) }
}

export default populateOffenceResults
