import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"

import { isError } from "../types/Result"
import parseAnnotatedPncUpdateDatasetXml from "./parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import { parsePncUpdateDataSetXml } from "./parse/parsePncUpdateDataSetXml"
import parseAhoXml from "./parseAhoXml/parseAhoXml"

export const parseHearingOutcome = (
  hearingOutcome: string,
  logger?: { error: (str: string) => void }
): AnnotatedHearingOutcome | Error | PncUpdateDataset => {
  const annotatedPncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(hearingOutcome)
  if (!isError(annotatedPncUpdateDataset)) {
    return annotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
  }

  const pncUpdateDataset = parsePncUpdateDataSetXml(hearingOutcome)
  if (!isError(pncUpdateDataset)) {
    return pncUpdateDataset
  }

  const aho = parseAhoXml(hearingOutcome)

  if (isError(aho) && logger) {
    logger.error(`Failed to parse aho: ${aho}`)
  }

  return aho
}
