import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import parseAnnotatedPNCUpdateDatasetXml from "@moj-bichard7/core/phase2/parse/parseAnnotatedPNCUpdateDatasetXml/parseAnnotatedPNCUpdateDatasetXml"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { isError } from "../types/Result"
import { isPncUpdateDataset } from "./isPncUpdateDataset"

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
