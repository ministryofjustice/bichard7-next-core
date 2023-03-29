import { createHash } from "crypto"
import fs from "fs"
import orderBy from "lodash.orderby"
import { dateReviver } from "src/lib/axiosDateTransformer"
import { ExceptionCode } from "src/types/ExceptionCode"
import getOffenceCode from "../../lib/offence/getOffenceCode"
import { parseAhoXml } from "../../parse/parseAhoXml"
import extractExceptionsFromAho from "../../parse/parseAhoXml/extractExceptionsFromAho"
import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { PncCourtCase, PncOffence } from "../../types/PncQueryResult"
import type { Trigger } from "../../types/Trigger"
import type {
  CourtResultMatchingSummary,
  CourtResultSummary,
  MatchingComparisonOutput,
  PncSummary
} from "../types/MatchingComparisonOutput"

const sha256 = (content: string | null | undefined): string | null | undefined => {
  if (!content) {
    return content
  }
  return createHash("sha256").update(content).digest("hex").substring(0, 10)
}

const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path"])

const validExceptions: ExceptionCode[] = [
  ExceptionCode.HO100304,
  ExceptionCode.HO100310,
  ExceptionCode.HO100311,
  ExceptionCode.HO100312,
  ExceptionCode.HO100320,
  ExceptionCode.HO100328,
  ExceptionCode.HO100329,
  ExceptionCode.HO100332,
  ExceptionCode.HO100333
]

interface ComparisonFile {
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers?: Trigger[]
  exceptions?: Exception[]
}

const summariseCourtResult = (aho: AnnotatedHearingOutcome): CourtResultSummary => ({
  dateOfHearing: aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing,
  defendant: {
    offences: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => ({
      sequenceNumber: offence.CourtOffenceSequenceNumber,
      offenceCode: getOffenceCode(offence) ?? "",
      resultCodes: offence.Result.map((result) => result.CJSresultCode),
      startDate: offence.ActualOffenceStartDate.StartDate,
      endDate: offence.ActualOffenceEndDate?.EndDate
    }))
  }
})

const summarisePnc = (aho: AnnotatedHearingOutcome): PncSummary | undefined => {
  if (!aho.PncQuery) {
    return undefined
  } else {
    return {
      courtCases: aho.PncQuery.courtCases?.map((courtCase: PncCourtCase) => ({
        reference: sha256(courtCase.courtCaseReference) ?? "",
        offences: courtCase.offences.map((offence: PncOffence) => ({
          sequenceNumber: offence.offence.sequenceNumber,
          offenceCode: offence.offence.cjsOffenceCode,
          startDate: offence.offence.startDate,
          endDate: offence.offence.endDate
        }))
      }))
    }
  }
}

const hasMatch = (aho: AnnotatedHearingOutcome): boolean => {
  const hasCaseRef = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const hasOffenceRef = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (o) => !!o.CourtCaseReferenceNumber
  )
  return hasCaseRef || hasOffenceRef
}

const parseOffenceReasonSequence = (input: string | null | undefined): number | undefined => {
  if (!input) {
    return undefined
  }
  return Number(input)
}

const summariseMatching = (aho: AnnotatedHearingOutcome): CourtResultMatchingSummary | null => {
  if (!hasMatch(aho)) {
    return null
  }
  return {
    ...(aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
      ? { courtCaseReference: sha256(aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber) }
      : {}),
    defendant: {
      offences: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => ({
        hoSequenceNumber: offence.CourtOffenceSequenceNumber,
        ...(offence.CourtCaseReferenceNumber ? { courtCaseReference: sha256(offence.CourtCaseReferenceNumber) } : {}),
        addedByCourt: !!offence.AddedByTheCourt,
        pncSequenceNumber: parseOffenceReasonSequence(offence.CriminalProsecutionReference.OffenceReasonSequence)
      }))
    }
  }
}

const summariseExceptions = (ahoXml: string): Exception[] =>
  sortExceptions(extractExceptionsFromAho(ahoXml)).filter(({ code }) => validExceptions.includes(code))

const createCourtMatchComparison = (fileName: string): MatchingComparisonOutput => {
  const fileContents = fs.readFileSync(fileName)
  const fileJson = JSON.parse(fileContents.toString(), dateReviver) as ComparisonFile

  let inputAho: AnnotatedHearingOutcome | Error

  if (fileJson.incomingMessage.match(/DeliverRequest/)) {
    const parsedSpi = parseSpiResult(fileJson.incomingMessage)
    inputAho = transformSpiToAho(parsedSpi)
  } else {
    inputAho = parseAhoXml(fileJson.incomingMessage)
  }
  if (inputAho instanceof Error) {
    console.error("Error parsing incoming message")
    throw inputAho
  }

  const outputAho: AnnotatedHearingOutcome | Error = parseAhoXml(fileJson.annotatedHearingOutcome)
  if (outputAho instanceof Error) {
    console.error("Error parsing output message")
    throw outputAho
  }

  return {
    courtResult: summariseCourtResult(inputAho),
    pnc: summarisePnc(outputAho),
    matching: summariseMatching(outputAho),
    exceptions: summariseExceptions(fileJson.annotatedHearingOutcome),
    file: fileName
  }
}

export default createCourtMatchComparison
