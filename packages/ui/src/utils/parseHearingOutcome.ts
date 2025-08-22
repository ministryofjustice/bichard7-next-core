import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/common/aho/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import parsePncUpdateDataSetXml from "@moj-bichard7/common/aho/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import { isError } from "../types/Result"

const parseHearingOutcome = (hearingOutcome: string): AnnotatedHearingOutcome | PncUpdateDataset | Error => {
  const annotatedPncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(hearingOutcome)
  if (!isError(annotatedPncUpdateDataset)) {
    return annotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
  }

  const pncUpdateDataset = parsePncUpdateDataSetXml(hearingOutcome)
  if (!isError(pncUpdateDataset)) {
    return pncUpdateDataset
  }

  return parseAhoXml(hearingOutcome)
}

export default parseHearingOutcome
