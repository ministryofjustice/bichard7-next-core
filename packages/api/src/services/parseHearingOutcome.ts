import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { FastifyBaseLogger } from "fastify"

import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/common/aho/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import { parsePncUpdateDataSetXml } from "@moj-bichard7/common/aho/parse/parsePncUpdateDataSetXml/index"
import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import { isError } from "@moj-bichard7/common/types/Result"

const parseHearingOutcome = (hearingOutcome: string, logger: FastifyBaseLogger): AnnotatedHearingOutcome | Error => {
  const annotatedPncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(hearingOutcome)
  if (!isError(annotatedPncUpdateDataset)) {
    return annotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
  }

  const pncUpdateDataset = parsePncUpdateDataSetXml(hearingOutcome)
  if (!isError(pncUpdateDataset)) {
    return pncUpdateDataset
  }

  const aho = parseAhoXml(hearingOutcome)

  if (isError(aho)) {
    logger.error(`Failed to parse aho: ${aho}`)
  }

  return aho
}

export default parseHearingOutcome
