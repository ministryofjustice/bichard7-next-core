import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

const addNullElementsForExceptions = (aho: AnnotatedHearingOutcome) => {
  aho.Exceptions.forEach((exception) => {
    let object: any = aho
    exception.path.forEach((key, i) => {
      if (i === exception.path.length - 1) {
        object[key] ??= null
      } else {
        object[key] ??= {}
        object = object[key]
      }
    })
  })
}

export default addNullElementsForExceptions
