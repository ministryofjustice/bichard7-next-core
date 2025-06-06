import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"
import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/core/lib/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import parsePncUpdateDataSetXml from "@moj-bichard7/core/lib/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"

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
