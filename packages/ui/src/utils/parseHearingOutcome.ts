import parseAnnotatedPNCUpdateDatasetXml from "@moj-bichard7-developers/bichard7-next-core/core/phase2/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"
import { isPncUpdateDataset } from "./isPncUpdateDataset"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { isError } from "../types/Result"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"

const parseHearingOutcome = (hearingOutcome: string): AnnotatedHearingOutcome | Error => {
  let aho: AnnotatedHearingOutcome | Error

  if (isPncUpdateDataset(hearingOutcome)) {
    const pncUpdateDataset = parseAnnotatedPNCUpdateDatasetXml(hearingOutcome)

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
