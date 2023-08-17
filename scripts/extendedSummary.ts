import type { PncCourtCase, PncOffence, PncPenaltyCase } from "common/pnc/PncQueryResult"
import type { AnnotatedHearingOutcome, Offence } from "core/common/types/AnnotatedHearingOutcome"
import getFile from "core/phase1/comparison/lib/getFile"
import { lookupOffenceByCjsCode, lookupResultCodeByCjsCode, lookupVerdictByCjsCode } from "core/phase1/dataLookup"
import getOffenceCode from "core/phase1/lib/offence/getOffenceCode"
import { parseAhoXml } from "core/phase1/parse/parseAhoXml"
import parseSpiResult from "core/phase1/parse/parseSpiResult"
import transformSpiToAho from "core/phase1/parse/transformSpiToAho"
import type Exception from "core/phase1/types/Exception"
import type { Trigger } from "core/phase1/types/Trigger"
import fs from "fs"
import { exec } from "node:child_process"

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

const summariseAho = (aho: AnnotatedHearingOutcome): string[] => {
  return aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => {
    const courtOffenceSequenceNumber = offence.CourtOffenceSequenceNumber.toString().padStart(3, "0")
    const manualSequenceNumber = getManualSequenceNumber(offence)
    const manualSequenceNumberStr = manualSequenceNumber ? ` (${manualSequenceNumber}) ` : ""
    const sequenceNumbers = `${courtOffenceSequenceNumber}${manualSequenceNumberStr}`.padEnd(10, " ")
    let offenceCode = getOffenceCode(offence) ?? ""
    const offenceTitle = lookupOffenceByCjsCode(offenceCode)?.offenceTitle
    offenceCode = offenceCode.padEnd(10, " ")
    const verdict = `${" ".repeat(54)}Verdict: ${lookupVerdictByCjsCode(offence.Result[0].Verdict ?? "")?.description}`
    const resultDescriptions = offence.Result.map(
      ({ CJSresultCode }) =>
        `${" ".repeat(54)}${CJSresultCode} ${lookupResultCodeByCjsCode(CJSresultCode.toString())?.description}`
    ).join("\n")
    const startDate = formatDate(offence.ActualOffenceStartDate.StartDate).padEnd(11, " ")
    const endDate = formatDate(offence.ActualOffenceEndDate?.EndDate).padEnd(11, " ")
    const convictionDate = formatDate(offence.ConvictionDate).padEnd(12, " ")
    let manualCCR = ""
    if (offence.ManualCourtCaseReference) {
      manualCCR = `\n    ${offence.CourtCaseReferenceNumber}`
    }
    return `${sequenceNumbers}${offenceCode}${startDate}${endDate}${convictionDate}${offenceTitle} ${manualCCR}\n${verdict}\n${resultDescriptions}\n`
  })
}

const disposalType = {
  F: "FINAL",
  I: "INTERIM",
  P: "P"
}

const summarisePnc = (aho: AnnotatedHearingOutcome | Error): string[] => {
  const output: string[] = []

  if (!(aho instanceof Error) && aho.PncQuery) {
    const theCases = aho.PncQuery.courtCases ?? aho.PncQuery.penaltyCases
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
        const adjudication = offence.adjudication?.verdict ? `Adjudication: ${offence.adjudication?.verdict}` : ""
        const resultDescriptions =
          offence.disposals
            ?.map((disposal) => {
              const padding = " ".repeat(54)
              const resultLookup = lookupResultCodeByCjsCode(disposal.type.toString())
              const description = resultLookup?.description ?? ""
              const type = resultLookup?.type as "F" | "I" | "P" | undefined
              const final = type ? disposalType[type] : ""
              return `\n${padding}${disposal.type} ${description} (${final})`
            })
            .join("") ?? ""
        output.push(
          `${sequence}${offenceCode}${startDate}${endDate}${adjudicationDate}${adjudication}${resultDescriptions}\n`
        )
      })
    })
  }

  return output
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

  output.push(`Correlation ID: ${aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID}`)
  output.push(`Hearing Date: ${formatDate(aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing)}`)
  output.push(`ASN: ${aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber}`)
  output.push(`PTIURN: ${aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN}\n`)

  output.push("Incoming Court Offences\n")
  output.push(...summariseAho(aho))
  output.push("\nExisting PNC Offences")

  const outputAho: AnnotatedHearingOutcome | Error = parseAhoXml(fileJson.annotatedHearingOutcome)
  output.push(...summarisePnc(outputAho))

  const textOutput = output.join("\n")

  const localFileName = fileName.replace("s3://bichard-7-production-processing-validation", "/tmp/comparison")
  const outFileName = localFileName.replace(".json", ".extended.summary.txt")

  fs.writeFileSync(outFileName, textOutput)

  exec(`code ${outFileName}`)
}

main()
