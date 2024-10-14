import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

const buildExceptionsPath = (paths: (string | number)[]): string =>
  paths.reduce((acc: string, item) => (typeof item === "string" ? `${acc}.${item}` : `${acc}[${item}]`), "").slice(1)

const isException = (aho: AnnotatedHearingOutcome, objPath: string): ExceptionCode | null => {
  const stringExpceptionsPath = aho.Exceptions.map(({ path }) => buildExceptionsPath(path))
  const resultIndex = stringExpceptionsPath.findIndex((path) => path === objPath)

  return resultIndex > -1 ? aho.Exceptions[resultIndex].code : null
}

export default isException
