import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import HO200100 from "./HO200100"
import HO200101 from "./HO200101"
import HO200103 from "./HO200103"
import HO200104 from "./HO200104"
import HO200106 from "./HO200106"
import HO200108 from "./HO200108"
import HO200109 from "./HO200109"
import HO200110 from "./HO200110"
import HO200112 from "./HO200112"
import HO200113 from "./HO200113"
import HO200114 from "./HO200114"
import HO200115 from "./HO200115"
import HO200116 from "./HO200116"
import HO200117 from "./HO200117"
import HO200118 from "./HO200118"
import HO200121 from "./HO200121"
import HO200124 from "./HO200124"
import HO200200 from "./HO200200"
import HO200201 from "./HO200201"
import HO200202 from "./HO200202"
import HO200205 from "./HO200205"
import HO200212 from "./HO200212"

// prettier-ignore
const generators: ExceptionGenerator[] = [
  HO200100, HO200101, HO200103, HO200104, HO200106, HO200108, HO200109, HO200112, HO200113,
  HO200114, HO200115, HO200118, HO200121, HO200124, HO200200, HO200201, HO200202, HO200205
]

const generateExceptions = (aho: AnnotatedHearingOutcome): Exception[] => {
  const ho200212 = HO200212(aho)
  if (ho200212.length > 0) {
    return ho200212
  }

  const exceptions = [...HO200110(aho), ...HO200116(aho), ...HO200117(aho)]
  if (exceptions.length > 0) {
    return exceptions
  }

  return generators.reduce((exceptions: Exception[], generator) => {
    exceptions.push(...generator(aho, { exceptions }))

    return exceptions
  }, [])
}

export default generateExceptions
