import fetchFile from "src/comparison/cli/fetchFile"
import DynamoGateway from "src/comparison/lib/DynamoGateway"
import createDynamoDbConfig from "src/comparison/lib/createDynamoDbConfig"
import { isError } from "src/comparison/types"
import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import offencesMatch from "src/enrichAho/enrichFunctions/enrichCourtCases/offenceMatcher/offencesMatch"
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

const getHoOffence = (aho: AnnotatedHearingOutcome, sequence: number): Offence | undefined =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.find(
    (o) => o.CourtOffenceSequenceNumber === sequence
  )

const identify = (summary: CourtResultMatchingSummary | null, aho: AnnotatedHearingOutcome): boolean => {
  if (!summary || "exceptions" in summary) {
    return false
  }
  const offencesAddedInCourt = summary.offences.filter((o) => o.addedByCourt)
  const pncOffencesForCourtAddedOffences =
    aho.PncQuery?.courtCases
      ?.map((cc) =>
        cc.offences
          .filter((o) => {
            const matches = offencesAddedInCourt.some((courtOffence) => {
              const hoOffence = getHoOffence(aho, courtOffence.hoSequenceNumber)
              return !!hoOffence && offencesMatch(hoOffence, o)
            })
            return matches
          })
          .map((o) => ({ offence: o, courtCaseReference: cc.courtCaseReference }))
      )
      .flat() ?? []

  const matchedPncOffences = pncOffencesForCourtAddedOffences.filter((o) =>
    summary.offences.some(
      (match) =>
        o.offence.offence.sequenceNumber === match.pncSequenceNumber &&
        (o.courtCaseReference === match.courtCaseReference || o.courtCaseReference === summary.courtCaseReference)
    )
  )

  return (
    offencesAddedInCourt.length > 0 &&
    pncOffencesForCourtAddedOffences.length > 0 &&
    matchedPncOffences.length < pncOffencesForCourtAddedOffences.length
  )
}

const main = async () => {
  const dynamo = new DynamoGateway(dynamoConfig)
  // Fetch dynamo range
  for await (const batch of dynamo.getRange(start, end, undefined, 1000, true)) {
    if (!batch || batch instanceof Error) {
      console.error(batch)
      throw new Error("Error fetching batch from Dynamo")
    }

    const filePromises = batch.map(async (record) => ({ file: await fetchFile(record, true), record }))
    const files = await Promise.all(filePromises)

    for (const {
      file: { contents, fileName },
      record
    } of files) {
      if (contents) {
        if (
          fileName ===
          "s3://bichard-7-production-processing-validation/2023/03/22/11/09/ProcessingValidation-c23362f4-ab2d-4a6d-b689-b2e80d932a39.json"
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
