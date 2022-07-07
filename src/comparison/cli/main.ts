process.env.NODE_ENV = "test"

import getArgs from "./getArgs"
import printOutput, { printSingleSummary } from "./printOutput"
import processFile from "./processFile"
import processRange from "./processRange"

const main = async () => {
  const args = getArgs()
  const filter = args.filter ?? "failure"
  if ("file" in args && args.file) {
    const result = await processFile(args.file, !!args.cache)
    printOutput(result)
    printSingleSummary(result)
  } else if ("start" in args || "end" in args) {
    if ("start" in args && "end" in args && args.start && args.end) {
      const results = await processRange(args.start, args.end, filter, !!args.cache)
      printOutput(results)
    } else {
      console.error("You must specify both a start and end time")
    }
  }
}

export default main
