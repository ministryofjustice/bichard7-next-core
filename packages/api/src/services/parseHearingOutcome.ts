import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

import { isError } from "@moj-bichard7/common/types/Result"
import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/core/phase2/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"

const isPncUpdateDatasetFromXml = (message: string) => message.match(/<AnnotatedPNCUpdateDataset/)

const parseHearingOutcome = (hearingOutcome: string): AnnotatedHearingOutcome | Error => {
  let aho: AnnotatedHearingOutcome | Error

  if (isPncUpdateDatasetFromXml(hearingOutcome)) {
    const pncUpdateDataset = parseAnnotatedPncUpdateDatasetXml(hearingOutcome)

    if (isError(pncUpdateDataset)) {
      console.error(`Failed to parse AnnotatedPNCUpdateDatasetXml: ${pncUpdateDataset}`)

      aho = pncUpdateDataset
    } else {
      aho = pncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset
    }
  } else {
    aho = parseAhoXml(hearingOutcome)

    if (isError(aho)) {
      console.error(`Failed to parse aho: ${aho}`)
    }
  }

  return aho
}

export default parseHearingOutcome
