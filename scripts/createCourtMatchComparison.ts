import { createHash } from "crypto"
import fs from "fs"
import orderBy from "lodash.orderby"
import { ExceptionCode } from "src/types/ExceptionCode"
import getOffenceCode from "../src/lib/offence/getOffenceCode"
import { parseAhoXml } from "../src/parse/parseAhoXml"
import extractExceptionsFromAho from "../src/parse/parseAhoXml/extractExceptionsFromAho"
import parseSpiResult from "../src/parse/parseSpiResult"
import transformSpiToAho from "../src/parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "../src/types/AnnotatedHearingOutcome"
import type Exception from "../src/types/Exception"
import type { PncCourtCase, PncOffence } from "../src/types/PncQueryResult"
import type { Trigger } from "../src/types/Trigger"

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

type CourtResultSummary = {
  defendant: {
    offences: {
      sequenceNumber: number
      offenceCode: string
      resultCodes: number[]
      startDate: Date
      endDate?: Date
    }[]
  }
}

type CourtResultMatchingSummary = {
  courtCaseReference?: string
  defendant: {
    offences: {
      hoSequenceNumber: number
      courtCaseReference?: string | null
      addedByCourt?: boolean
      pncSequenceNumber?: number
    }[]
  }
}

const summariseCourtResult = (aho: AnnotatedHearingOutcome): CourtResultSummary => ({
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

const summarisePnc = (aho: AnnotatedHearingOutcome): Record<string, any> | undefined => {
  if (!aho.PncQuery) {
    return undefined
  } else {
    return {
      courtCases: aho.PncQuery.courtCases?.map((courtCase: PncCourtCase) => ({
        reference: sha256(courtCase.courtCaseReference),
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
    courtCaseReference: sha256(aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber) ?? undefined,
    defendant: {
      offences: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => ({
        hoSequenceNumber: offence.CourtOffenceSequenceNumber,
        courtCaseReference: sha256(offence.CourtCaseReferenceNumber),
        addedByCourt: !!offence.AddedByTheCourt,
        pncSequenceNumber: parseOffenceReasonSequence(offence.CriminalProsecutionReference.OffenceReasonSequence)
      }))
    }
  }
}

const summariseExceptions = (ahoXml: string): Exception[] =>
  sortExceptions(extractExceptionsFromAho(ahoXml)).filter(({ code }) => validExceptions.includes(code))

const fileName = process.argv[2]
if (!fileName) {
  console.error("No file provided")
  process.exit()
}

const localFileName = fileName.startsWith("s3://")
  ? fileName.replace("s3://bichard-7-production-processing-validation", "/tmp/comparison")
  : fileName

const fileContents = fs.readFileSync(localFileName)
const fileJson = JSON.parse(fileContents.toString()) as ComparisonFile

let inputAho: AnnotatedHearingOutcome | Error

if (fileJson.incomingMessage.match(/DeliverRequest/)) {
  const parsedSpi = parseSpiResult(fileJson.incomingMessage)
  inputAho = transformSpiToAho(parsedSpi)
} else {
  inputAho = parseAhoXml(fileJson.incomingMessage)
}
if (inputAho instanceof Error) {
  console.error("Error parsing incoming message")
  process.exit(1)
}

const outputAho: AnnotatedHearingOutcome | Error = parseAhoXml(fileJson.annotatedHearingOutcome)
if (outputAho instanceof Error) {
  console.error("Error parsing output message")
  process.exit(1)
}

const output = {
  courtResult: summariseCourtResult(inputAho),
  pnc: summarisePnc(outputAho),
  matching: summariseMatching(outputAho),
  exceptions: summariseExceptions(fileJson.annotatedHearingOutcome)
}

console.log(JSON.stringify(output, null, 2))
// const outFileName = localFileName.replace(".json", ".summary.txt")

// fs.writeFileSync(outFileName, textOutput)

// exec(`code ${outFileName}`)
