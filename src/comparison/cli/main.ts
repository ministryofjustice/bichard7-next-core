process.env.NODE_ENV = "test"

import getArgs from "./getArgs"
import printResult, { printSingleSummary } from "./printResult"
import processFile from "./processFile"
import processRange from "./processRange"

const main = async () => {
  const args = getArgs()
  const filter = args.filter ?? "failure"
  if ("file" in args && args.file) {
    const result = await processFile(args.file, !!args.cache)
    printResult(result, !args.noTruncate)
    printSingleSummary(result)
  } else if ("start" in args || "end" in args) {
    if ("start" in args && "end" in args && args.start && args.end) {
      const results = await processRange(args.start, args.end, filter, !!args.cache)
      printResult(results, !args.noTruncate)
    } else {
      console.error("You must specify both a start and end time")
    }
  }
}

export default main
