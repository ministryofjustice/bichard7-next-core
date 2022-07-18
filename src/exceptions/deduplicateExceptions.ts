import type Exception from "src/types/Exception"

type AccumulatorObject = {
  [k: string]: Exception
}

const deduplicateExceptions = (exceptions: Exception[]): Exception[] =>
  Object.values(
    exceptions.reduce((acc: AccumulatorObject, exception) => {
      const key = `${exception.code}-${exception.path.join("/")}`
      acc[key] = exception
      return acc
    }, {})
  )

export default deduplicateExceptions
