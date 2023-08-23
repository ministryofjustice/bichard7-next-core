import fs from "fs"
import { exec } from "node:child_process"
import getFile from "phase1/comparison/lib/getFile"
import hoOffencesAreEqual from "phase1/comparison/lib/hoOffencesAreEqual"
import { lookupOffenceByCjsCode } from "phase1/dataLookup"
import offenceHasFinalResult from "phase1/enrichAho/enrichFunctions/matchOffencesToPnc/offenceHasFinalResult"
import getOffenceCode from "phase1/lib/offence/getOffenceCode"
import { parseAhoXml } from "phase1/parse/parseAhoXml"
import parseSpiResult from "phase1/parse/parseSpiResult"
import transformSpiToAho from "phase1/parse/transformSpiToAho"
import summariseMatching from "phase1/tests/helpers/summariseMatching"
import type Exception from "phase1/types/Exception"
import type { Trigger } from "phase1/types/Trigger"
import type { AnnotatedHearingOutcome, Offence } from "types/AnnotatedHearingOutcome"
import type { PncCourtCase, PncOffence, PncPenaltyCase } from "types/PncQueryResult"

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

const getManualSequenceNumber = (offence: Offence): string | undefined => {
  if (offence.ManualSequenceNumber && offence.CriminalProsecutionReference.OffenceReasonSequence) {
    return offence.CriminalProsecutionReference.OffenceReasonSequence
  }
}

const groupEqualOffences = (offences: Offence[]): Offence[][] => {
  const output = []
  for (const offence of offences) {
    let found = false
    for (const group of output) {
      const otherOffence = group[0]
      if (hoOffencesAreEqual(offence, otherOffence)) {
        group.push(offence)
        found = true
        break
      }
    }
    if (!found) {
      output.push([offence])
    }
  }
  return output
}

const summariseAho = (aho: AnnotatedHearingOutcome): string[] => {
  const groupedOffences = groupEqualOffences(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence)
  return aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => {
    const courtOffenceSequenceNumber = offence.CourtOffenceSequenceNumber.toString().padStart(3, "0")
    const manualSequenceNumber = getManualSequenceNumber(offence)
    const manualSequenceNumberStr = manualSequenceNumber ? ` (${manualSequenceNumber}) ` : ""
    const sequenceNumbers = `${courtOffenceSequenceNumber}${manualSequenceNumberStr}`.padEnd(10, " ")
    const offenceCode = (getOffenceCode(offence) ?? "").padEnd(10, " ")
    const resultCodes = offence.Result.map((result) => result.CJSresultCode.toString())
      .sort()
      .join(",")
    const startDate = formatDate(offence.ActualOffenceStartDate.StartDate).padEnd(11, " ")
    const endDate = formatDate(offence.ActualOffenceEndDate?.EndDate).padEnd(11, " ")
    const convictionDate = formatDate(offence.ConvictionDate).padEnd(12, " ")
    const offenceGroupIndex = groupedOffences.findIndex((group) => group.includes(offence))
    const offenceLookup = lookupOffenceByCjsCode(offenceCode.trim())
    const breach = offenceLookup?.offenceCategory === "CB" ? " Breach" : ""
    let manualCCR = ""
    if (offence.ManualCourtCaseReference) {
      manualCCR = `\n    ${offence.CourtCaseReferenceNumber}`
    }
    return `${sequenceNumbers}${offenceCode}${startDate}${endDate}${convictionDate}${resultCodes}${breach} ${offenceGroupIndex}${manualCCR}`
  })
}

const main = async () => {
  const fileContents = await getFile(fileName, true)
  const fileJson = JSON.parse(fileContents.toString()) as ComparisonFile

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
    const theCases = [...(outputAho.PncQuery.courtCases ?? []), ...(outputAho.PncQuery.penaltyCases ?? [])]
    theCases?.forEach((courtCase: PncCourtCase | PncPenaltyCase) => {
      output.push("")
      const caseReference =
        "courtCaseReference" in courtCase ? courtCase.courtCaseReference : `${courtCase.penaltyCaseReference} PENALTY`
      output.push(caseReference)
      courtCase.offences.forEach((offence: PncOffence) => {
        const sequence = offence.offence.sequenceNumber.toString().padStart(3, "0").padEnd(10, " ")
        const offenceCode = offence.offence.cjsOffenceCode.padEnd(10, " ")
        const startDate = formatDate(offence.offence.startDate).padEnd(11, " ")
        const endDate = formatDate(offence.offence.endDate).padEnd(11, " ")
        const adjudicationDate = formatDate(offence.adjudication?.sentenceDate).padEnd(12, " ")
        const hasFinalDisposal = offenceHasFinalResult(offence) ? "F " : ""
        const hasAdjudication = !!offence.adjudication ? "A " : ""
        output.push(
          `${sequence}${offenceCode}${startDate}${endDate}${adjudicationDate}${hasAdjudication}${hasFinalDisposal}`
        )
      })
    })
  }

  if (!(outputAho instanceof Error)) {
    const matchingSummary = summariseMatching(outputAho)
    output.push("\n")
    if (matchingSummary && "offences" in matchingSummary) {
      output.push("Offence matches\n")
      matchingSummary.offences.forEach((match) =>
        output.push(
          `${match.hoSequenceNumber} => ${match.courtCaseReference ?? matchingSummary.caseReference} / ${
            match.pncSequenceNumber ?? "Added in court"
          }`
        )
      )
    } else if (matchingSummary && "exceptions" in matchingSummary) {
      output.push(JSON.stringify(matchingSummary, null, 2))
    } else {
      output.push("No matches")
    }
  }

  const textOutput = output.join("\n")

  const localFileName = fileName.replace("s3://bichard-7-production-processing-validation", "/tmp/comparison")
  const outFileName = localFileName.replace(".json", ".summary.txt")

  fs.writeFileSync(outFileName, textOutput)

  if (process.env.NO_OPEN !== "true") {
    exec(`code ${outFileName}`)
  }
}

main()
