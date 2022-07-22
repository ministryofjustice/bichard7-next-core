import getFile from "src/comparison/getFile"
import getArgs from "./getArgs"
import printResult from "./printResult"
import processFile from "./processFile"
import processRange from "./processRange"
import readReceivedDateFromS3ObjectKey from "./readReceivedDateFromS3ObjectKey"

const main = async () => {
  const args = getArgs()
  const filter = args.filter ?? "failure"
  if ("file" in args && args.file) {
    const contents = await getFile(args.file, !!args.cache)
    const date = readReceivedDateFromS3ObjectKey(args.file)
    const result = processFile(contents, args.file, date)
    printResult(result, !args.noTruncate)
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
