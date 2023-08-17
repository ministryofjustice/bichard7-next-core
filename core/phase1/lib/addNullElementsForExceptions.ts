import type { AnnotatedHearingOutcome } from "core/common/types/AnnotatedHearingOutcome"

const addNullElementsForExceptions = (aho: AnnotatedHearingOutcome) => {
  aho.Exceptions.forEach((exception) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
