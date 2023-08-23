import getDateFromComparisonFilePath from "phase1/comparison/lib/getDateFromComparisonFilePath"
import getFile from "phase1/comparison/lib/getFile"
import runMissingComparisons from "phase1/comparison/lib/runMissingComparisons"
import checkPncMatching from "phase1/comparison/cli/checkPncMatching"
import getArgs from "phase1/comparison/cli/getArgs"
import printPncMatchingResult from "phase1/comparison/cli/printPncMatchingResult"
import printResult from "phase1/comparison/cli/printResult"
import processDirectory from "phase1/comparison/cli/processDirectory"
import processFailures from "phase1/comparison/cli/processFailures"
import processFile from "phase1/comparison/cli/processFile"
import processRange from "phase1/comparison/cli/processRange"

const main = async () => {
  let success = false
  const args = getArgs()
  const filter = args.filter ?? "failure"
  if ("file" in args && args.file) {
    const contents = await getFile(args.file, !!args.cache)
    const date = getDateFromComparisonFilePath(args.file)
    if ("matching" in args && args.matching) {
      const result = await checkPncMatching(contents, args.file, date)
      success = printPncMatchingResult(result, !args.noTruncate)
    } else {
      const result = await processFile(contents, args.file, date)
      success = printResult(result, !args.noTruncate, !!args.list)
    }
  } else if ("directory" in args && args.directory) {
    const results = await processDirectory(args.directory)
    success = printResult(results, !args.noTruncate, !!args.list)
  } else if ("runMissing" in args && args.runMissing) {
    await runMissingComparisons(args.runMissing)
  } else if ("matching" in args && args.matching) {
    if ("start" in args && "end" in args && args.start && args.end) {
      const results = await processRange(args.start, args.end, "all", !!args.cache, !!args.list, checkPncMatching)
      success = printPncMatchingResult(results, !args.noTruncate)
    } else {
      console.error("You must specify both a start and end time")
    }
  } else if ("start" in args || "end" in args) {
    if ("start" in args && "end" in args && args.start && args.end) {
      const results = await processRange(args.start, args.end, filter, !!args.cache, !!args.list, processFile)
      success = printResult(results, !args.noTruncate, !!args.list)
    } else {
      console.error("You must specify both a start and end time")
    }
  } else if (filter === "failure") {
    const results = await processFailures(!!args.cache)
    success = printResult(results, !args.noTruncate)
  }
  process.exit(Number(!success))
}

export default main
