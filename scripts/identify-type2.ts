import fetchFile from "src/comparison/cli/fetchFile"
import DynamoGateway from "src/comparison/lib/DynamoGateway"
import createDynamoDbConfig from "src/comparison/lib/createDynamoDbConfig"
import hoOffencesAreEqual from "src/comparison/lib/hoOffencesAreEqual"
import { isError } from "src/comparison/types"
import type { CourtResultMatchingSummary, OffenceMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { PncOffenceWithCaseRef } from "src/enrichAho/enrichFunctions/matchOffencesToPnc/matchOffencesToPnc"
import { parseAhoXml } from "src/parse/parseAhoXml"
import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import { parseComparisonFile } from "tests/helpers/processTestFile"
import summariseMatching from "tests/helpers/summariseMatching"

// Get start and end timestamps
const start = process.argv[2]
const end = process.argv[3]
if (!start || !end) {
  console.log("Usage: identify-issues.ts <start> <end>")
}

process.env.PHASE1_COMPARISON_TABLE_NAME =
  process.env.PHASE1_COMPARISON_TABLE_NAME ?? "bichard-7-production-comparison-log"
process.env.PHASE2_COMPARISON_TABLE_NAME =
  process.env.PHASE2_COMPARISON_TABLE_NAME ?? "bichard-7-production-phase2-comparison-log"
process.env.PHASE3_COMPARISON_TABLE_NAME =
  process.env.PHASE3_COMPARISON_TABLE_NAME ?? "bichard-7-production-phase3-comparison-log"
process.env.DYNAMO_URL = process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com"
process.env.DYNAMO_REGION = process.env.DYNAMO_REGION ?? "eu-west-2"
process.env.COMPARISON_S3_BUCKET = process.env.COMPARISON_S3_BUCKET ?? "bichard-7-production-processing-validation"
const dynamoConfig = createDynamoDbConfig()

const getHoOffence = (aho: AnnotatedHearingOutcome, sequence: number): Offence => {
  const hoOffence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.find(
    (o) => o.CourtOffenceSequenceNumber === sequence
  )
  if (!hoOffence) {
    throw new Error("Could not find HO offence")
  }
  return hoOffence
}

type OffenceMatch = {
  hoOffence: Offence
  pncOffence: PncOffenceWithCaseRef
}

const getPncOffence = (
  aho: AnnotatedHearingOutcome,
  courtCaseReference: string | null | undefined,
  sequence: number | undefined
): PncOffenceWithCaseRef => {
  const courtCase = aho.PncQuery?.courtCases?.find((cc) => cc.courtCaseReference === courtCaseReference)
  const pncOffence = courtCase?.offences.find((o) => o.offence.sequenceNumber === sequence)
  if (!pncOffence || !courtCase) {
    throw new Error("Could not find pnc offence")
  }
  return { pncOffence, courtCaseReference: courtCase?.courtCaseReference }
}

const getOffence = (
  aho: AnnotatedHearingOutcome,
  match: OffenceMatchingSummary,
  courtCaseReference: string | null | undefined
): OffenceMatch => {
  return {
    pncOffence: getPncOffence(aho, match.courtCaseReference || courtCaseReference, match.pncSequenceNumber),
    hoOffence: getHoOffence(aho, match.hoSequenceNumber)
  }
}

const groupPncOffences = (offenceMatches: OffenceMatch[]): OffenceMatch[][] => {
  const groups: OffenceMatch[][] = []
  for (const offenceMatch of offenceMatches) {
    let foundMatch = false
    for (const group of groups) {
      if (
        group[0].pncOffence.pncOffence.offence.cjsOffenceCode ===
          offenceMatch.pncOffence.pncOffence.offence.cjsOffenceCode &&
        group[0].pncOffence.pncOffence.offence.startDate.getTime() ===
          offenceMatch.pncOffence.pncOffence.offence.startDate.getTime()
      ) {
        group.push(offenceMatch)
        foundMatch = true
      }
    }

    if (!foundMatch) {
      groups.push([offenceMatch])
    }
  }
  return groups
}

const identify = (summary: CourtResultMatchingSummary | null, aho: AnnotatedHearingOutcome): boolean => {
  if (!summary || "exceptions" in summary) {
    return false
  }

  const matchedOffences = summary.offences
    .filter((match) => match.pncSequenceNumber !== undefined)
    .map((match) => getOffence(aho, match, summary.courtCaseReference))
    .filter((match) => !match.hoOffence.ManualSequenceNumber)

  const pncGroups = groupPncOffences(matchedOffences)
  for (const group of pncGroups) {
    const hoOffences = group.map(({ hoOffence }) => hoOffence)
    for (const hoOffence of hoOffences) {
      if (!hoOffencesAreEqual(hoOffence, hoOffences[0])) {
        return true
      }
    }
  }
  return false
}

const main = async () => {
  const dynamo = new DynamoGateway(dynamoConfig)
  // Fetch dynamo range
  for await (const batch of dynamo.getRange(start, end, undefined, 1000, true)) {
    if (!batch || batch instanceof Error) {
      console.error(batch)
      throw new Error("Error fetching batch from Dynamo")
    }

    const filePromises = batch
      .map((record) => ({ ...record, skipped: false }))
      .map(async (record) => ({ file: await fetchFile(record, true), record }))
    const files = await Promise.all(filePromises)

    for (const {
      file: { contents, fileName },
      record
    } of files) {
      if (contents) {
        if (
          fileName ===
          "s3://bichard-7-production-processing-validation/2023/03/27/11/06/ProcessingValidation-1fd7a10e-43e7-4994-9fb4-cd33a756b018.json"
        ) {
          debugger
        }
        const comparison = parseComparisonFile(contents)
        if ("annotatedHearingOutcome" in comparison) {
          const aho = parseAhoXml(comparison.annotatedHearingOutcome)
          if (isError(aho)) {
            throw aho
          }
          const summary = summariseMatching(aho)
          if (identify(summary, aho)) {
            console.log(fileName)
          }
        }
      }
    }

    // Get file
    // Identify conditions
    // Print S3 path
  }
}

main()
