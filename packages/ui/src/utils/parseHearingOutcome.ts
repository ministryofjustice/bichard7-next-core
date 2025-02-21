import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import parsePncUpdateDatasetXml from "@moj-bichard7/core/lib/parse/parsePncUpdateDatasetXml/parsePncUpdateDatasetXml"

import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/core/lib/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/core/types/PncUpdateDataset"
import { isError } from "../types/Result"

const parseHearingOutcome = (hearingOutcome: string): AnnotatedHearingOutcome | PncUpdateDataset | Error => {
  const annotatedPncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(hearingOutcome)
  if (!isError(annotatedPncUpdateDataset)) {
    return annotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
  }

  const pncUpdateDataset = parsePncUpdateDatasetXml(hearingOutcome)
  if (!isError(pncUpdateDataset)) {
    return pncUpdateDataset
  }

  return parseAhoXml(hearingOutcome)
}

export default parseHearingOutcome
