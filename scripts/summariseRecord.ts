import fs from "fs"
import { exec } from "node:child_process"
import getOffenceCode from "../src/lib/offence/getOffenceCode"
import { parseAhoXml } from "../src/parse/parseAhoXml"
import parseSpiResult from "../src/parse/parseSpiResult"
import transformSpiToAho from "../src/parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "../src/types/AnnotatedHearingOutcome"
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

const formatDate = (date: Date | undefined): string => (date ? date.toISOString().split("T")[0] : "")

const fileContents = fs.readFileSync(fileName)
const fileJson = JSON.parse(fileContents.toString()) as ComparisonFile

// const summariseAho = null
const summariseAho = (aho: AnnotatedHearingOutcome): string[] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => {
    const courtOffenceSequenceNumber = offence.CourtOffenceSequenceNumber.toString().padStart(3, "0").padEnd(6, " ")
    const offenceCode = (getOffenceCode(offence) ?? "").padEnd(10, " ")
    const resultCodes = offence.Result.map((result) => result.CJSresultCode.toString()).join(",")
    const startDate = formatDate(offence.ActualOffenceStartDate.StartDate).padEnd(13, " ")
    const endDate = formatDate(offence.ActualOffenceEndDate?.EndDate).padEnd(13, " ")
    return `${courtOffenceSequenceNumber}${offenceCode}${startDate}${endDate}${resultCodes}`
  })

let aho: AnnotatedHearingOutcome | Error
const output: string[] = ["Incoming Records\n"]

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

output.push(...summariseAho(aho))
output.push("\nPNC Records")

const outputAho: AnnotatedHearingOutcome | Error = parseAhoXml(fileJson.annotatedHearingOutcome)

if (!(outputAho instanceof Error) && outputAho.PncQuery) {
  outputAho.PncQuery.courtCases?.forEach((courtCase: PncCourtCase) => {
    output.push("")
    output.push(courtCase.courtCaseReference)
    courtCase.offences.forEach((offence: PncOffence) => {
      const sequence = offence.offence.sequenceNumber.toString().padStart(3, "0").padEnd(6, " ")
      const offenceCode = offence.offence.cjsOffenceCode.padEnd(10, " ")
      const startDate = formatDate(offence.offence.startDate).padEnd(13, " ")
      const endDate = formatDate(offence.offence.endDate).padEnd(13, " ")
      output.push(`${sequence}${offenceCode}${startDate}${endDate}`)
    })
  })
}

const textOutput = output.join("\n")

const outFileName = fileName.replace(".json", ".summary.txt")

fs.writeFileSync(outFileName, textOutput)

exec(`code ${outFileName}`)
