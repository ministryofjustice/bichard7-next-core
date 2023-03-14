import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import getFile from "../lib/getFile"
import runMissingComparisons from "../lib/runMissingComparisons"
import getArgs from "./getArgs"
import printResult from "./printResult"
import processFailures from "./processFailures"
import processFile from "./processFile"
import processRange from "./processRange"

const main = async () => {
  const args = getArgs()
  const filter = args.filter ?? "failure"
  if ("file" in args && args.file) {
    const contents = await getFile(args.file, !!args.cache)
    const date = getDateFromComparisonFilePath(args.file)
    const result = await processFile(contents, args.file, date)
    printResult(result, !args.noTruncate)
  } else if ("runMissing" in args && args.runMissing) {
    await runMissingComparisons(args.runMissing)
  } else if ("start" in args || "end" in args) {
    if ("start" in args && "end" in args && args.start && args.end) {
      const results = await processRange(args.start, args.end, filter, !!args.cache)
      printResult(results, !args.noTruncate)
    } else {
      console.error("You must specify both a start and end time")
    }
  } else if (filter === "failure") {
    const results = await processFailures(!!args.cache)
    printResult(results, !args.noTruncate)
  }
}

export default main
