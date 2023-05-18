import fetchFile from "src/comparison/cli/fetchFile"
import DynamoGateway from "src/comparison/lib/DynamoGateway"
import comparePncMatching from "src/comparison/lib/comparePncMatching"
import createDynamoDbConfig from "src/comparison/lib/createDynamoDbConfig"
import hoOffencesAreEqual from "src/comparison/lib/hoOffencesAreEqual"
import badlyAnnotatedSingleCaseMatch from "src/comparison/lib/isIntentionalMatchingDifference/badlyAnnotatedSingleCaseMatch"
import { isError } from "src/comparison/types"
import type { OldPhase1Comparison, Phase1Comparison } from "src/comparison/types/ComparisonFile"
import type { CourtResultMatchingSummary, OffenceMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { PncOffenceWithCaseRef } from "src/enrichAho/enrichFunctions/matchOffencesToPnc/matchOffencesToPnc"
import { findMatchCandidates } from "src/enrichAho/enrichFunctions/matchOffencesToPnc/matchOffencesToPnc"
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
process.env.USE_NEW_MATCHER = "true"
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

const groupHoOffences = (offenceMatches: OffenceMatch[]): Offence[][] => {
  const hoOffences = offenceMatches.map((match) => match.hoOffence)
  const pncOffences = offenceMatches.map((match) => match.pncOffence)

  const matches = findMatchCandidates(hoOffences, [pncOffences], { exactDateMatch: false })

  const groups = matches.matchedPncOffences().map((pncOffence) => matches.forPncOffence(pncOffence))
  return groups
}

const identifyCandidatesA = (summary: CourtResultMatchingSummary | null, aho: AnnotatedHearingOutcome): boolean => {
  if (!summary || "exceptions" in summary || aho.Exceptions.length > 0) {
    return false
  }

  const matchedOffences = summary.offences
    .filter((match) => match.pncSequenceNumber !== undefined)
    .map((match) => getOffence(aho, match, summary.courtCaseReference))
    .filter((match) => !match.hoOffence.ManualSequenceNumber)

  const hoGroups = groupHoOffences(matchedOffences)
  for (const group of hoGroups) {
    for (const hoOffence of group) {
      if (!hoOffencesAreEqual(hoOffence, group[0])) {
        return true
      }
    }
  }

  return false
}

type Group = {
  hoOffences: Set<Offence>
  pncOffences: Set<PncOffenceWithCaseRef>
}

const identifyCandidatesB = (aho: AnnotatedHearingOutcome): boolean => {
  if (aho.Exceptions.length > 0) {
    return false
  }

  const hoOffences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const pncOffences: PncOffenceWithCaseRef[] | undefined = aho.PncQuery?.courtCases
    ?.map((cc) => cc.offences.map((pncOffence) => ({ pncOffence, courtCaseReference: cc.courtCaseReference })))
    .flat()

  if (!pncOffences) {
    return false
  }

  const candidates = findMatchCandidates(hoOffences, [pncOffences])

  const groups: Group[] = []
  for (const hoOffence of candidates.matchedHoOffences()) {
    for (const pncOffence of candidates.forHoOffence(hoOffence)) {
      let group = groups.find((g) => g.hoOffences.has(hoOffence) || g.pncOffences.has(pncOffence))
      if (!group) {
        group = {
          hoOffences: new Set<Offence>(),
          pncOffences: new Set<PncOffenceWithCaseRef>()
        }
        groups.push(group)
      }

      group.pncOffences.add(pncOffence)

      for (const otherHoOffence of candidates.forPncOffence(pncOffence)) {
        group.hoOffences.add(otherHoOffence)
      }
    }
  }

  for (const group of groups) {
    if (group.hoOffences.size !== group.pncOffences.size) {
      return ![...group.hoOffences].some((hoOffence) => hoOffence.ManualSequenceNumber)
    }
  }

  return false
}

const comparisonFails = async (comparison: OldPhase1Comparison | Phase1Comparison): Promise<boolean> => {
  const result = await comparePncMatching(comparison)
  if (
    result.expected &&
    result.actual &&
    badlyAnnotatedSingleCaseMatch(
      result.expected,
      result.actual,
      {} as AnnotatedHearingOutcome,
      {} as AnnotatedHearingOutcome
    )
  ) {
    return false
  }
  return !result.pass
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
      file: { contents, fileName }
    } of files) {
      if (contents) {
        if (
          fileName ===
          "s3://bichard-7-production-processing-validation/2023/03/20/11/58/ProcessingValidation-12052ae2-e48f-4ac6-9a87-9edd90605c5e.json"
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
          const isCandidate = identifyCandidatesA(summary, aho) || identifyCandidatesB(aho)

          if (isCandidate) {
            const failedComparison = await comparisonFails(comparison)
            if (failedComparison) {
              console.log(fileName)
            }
          }
        }
      }
    }
  }
}

main()
