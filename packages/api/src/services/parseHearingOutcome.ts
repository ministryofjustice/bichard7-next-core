import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"
import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/core/phase2/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"

const isPncUpdateDatasetFromXml = (message: string) => /<AnnotatedPNCUpdateDataset/.exec(message)

const parseHearingOutcome = (hearingOutcome: string, logger?: FastifyBaseLogger): AnnotatedHearingOutcome | Error => {
  let aho: AnnotatedHearingOutcome | Error

  if (isPncUpdateDatasetFromXml(hearingOutcome)) {
    const pncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(hearingOutcome)

    if (isError(pncUpdateDataset)) {
      if (logger) {
        logger.error(`Failed to parse AnnotatedPNCUpdateDatasetXml: ${pncUpdateDataset}`)
      }

      aho = pncUpdateDataset
    } else {
      aho = pncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
    }
  } else {
    aho = parseAhoXml(hearingOutcome)

    if (isError(aho) && logger) {
      logger.error(`Failed to parse aho: ${aho}`)
    }
  }

  return aho
}

export default parseHearingOutcome
