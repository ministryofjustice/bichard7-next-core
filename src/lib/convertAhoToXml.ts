import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { XMLBuilder } from "fast-xml-parser"

const convertAhoToXml = (hearingOutcome: AnnotatedHearingOutcome): string => {
  const options = {
    ignoreAttributes : false
};

  const builder = new XMLBuilder(options);
  let xml = builder.build(hearingOutcome);

  return xml
}

export default convertAhoToXml
