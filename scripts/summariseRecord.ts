import fs from "fs"
import { exec } from "node:child_process"
import getOffenceCode from "../src/lib/offence/getOffenceCode"
import { parseAhoXml } from "../src/parse/parseAhoXml"
import parseSpiResult from "../src/parse/parseSpiResult"
import transformSpiToAho from "../src/parse/transformSpiToAho"
import type { AnnotatedHearingOutcome, Offence } from "../src/types/AnnotatedHearingOutcome"
import type Exception from "../src/types/Exception"
import type { PncCourtCase, PncOffence } from "../src/types/PncQueryResult"
import type { Trigger } from "../src/types/Trigger"

interface ComparisonFile {
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers?: Trigger[]
  exceptions?: Exception[]
}

const fileName = process.argv[2]
if (!fileName) {
  console.error("No file provided")
  process.exit()
}

const localFileName = fileName.startsWith("s3://")
  ? fileName.replace("s3://bichard-7-production-processing-validation", "/tmp/comparison")
  : fileName

const formatDate = (date: Date | undefined): string => (date ? date.toISOString().split("T")[0] : "")

const fileContents = fs.readFileSync(localFileName)
const fileJson = JSON.parse(fileContents.toString()) as ComparisonFile

const getManualSequenceNumber = (offence: Offence): string | undefined => {
  if (offence.ManualSequenceNumber && offence.CriminalProsecutionReference.OffenceReasonSequence) {
    return offence.CriminalProsecutionReference.OffenceReasonSequence
  }
}

// const summariseAho = null
const summariseAho = (aho: AnnotatedHearingOutcome): string[] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => {
    const courtOffenceSequenceNumber = offence.CourtOffenceSequenceNumber.toString().padStart(3, "0")
    const manualSequenceNumber = getManualSequenceNumber(offence)
    const manualSequenceNumberStr = manualSequenceNumber ? ` (${manualSequenceNumber}) ` : ""
    const sequenceNumbers = `${courtOffenceSequenceNumber}${manualSequenceNumberStr}`.padEnd(10, " ")
    const offenceCode = (getOffenceCode(offence) ?? "").padEnd(10, " ")
    const resultCodes = offence.Result.map((result) => result.CJSresultCode.toString()).join(",")
    const startDate = formatDate(offence.ActualOffenceStartDate.StartDate).padEnd(13, " ")
    const endDate = formatDate(offence.ActualOffenceEndDate?.EndDate).padEnd(13, " ")
    return `${sequenceNumbers}${offenceCode}${startDate}${endDate}${resultCodes}`
  })

let aho: AnnotatedHearingOutcome | Error
const output: string[] = []

if (fileJson.incomingMessage.match(/DeliverRequest/)) {
  const parsedSpi = parseSpiResult(fileJson.incomingMessage)
  aho = transformSpiToAho(parsedSpi)
} else {
  aho = parseAhoXml(fileJson.incomingMessage)
}
if (aho instanceof Error) {
  console.error("Error parsing incoming message")
  process.exit(1)
}

output.push(`Correlation ID: ${aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID}\n`)

output.push("Incoming Records\n")
output.push(...summariseAho(aho))
output.push("\nPNC Records")

const outputAho: AnnotatedHearingOutcome | Error = parseAhoXml(fileJson.annotatedHearingOutcome)

if (!(outputAho instanceof Error) && outputAho.PncQuery) {
  outputAho.PncQuery.courtCases?.forEach((courtCase: PncCourtCase) => {
    output.push("")
    output.push(courtCase.courtCaseReference)
    courtCase.offences.forEach((offence: PncOffence) => {
      const sequence = offence.offence.sequenceNumber.toString().padStart(3, "0").padEnd(10, " ")
      const offenceCode = offence.offence.cjsOffenceCode.padEnd(10, " ")
      const startDate = formatDate(offence.offence.startDate).padEnd(13, " ")
      const endDate = formatDate(offence.offence.endDate).padEnd(13, " ")
      output.push(`${sequence}${offenceCode}${startDate}${endDate}`)
    })
  })
}

const textOutput = output.join("\n")

const outFileName = localFileName.replace(".json", ".summary.txt")

fs.writeFileSync(outFileName, textOutput)

exec(`code ${outFileName}`)
