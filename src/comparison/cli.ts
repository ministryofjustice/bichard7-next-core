import fs from "fs"
import compare from "src/comparison/compare"
import { formatXmlDiff } from "src/comparison/xmlOutputComparison"

const FILE_PATH = process.argv.slice(-1)[0]

const contents = fs.readFileSync(FILE_PATH).toString()
const result = compare(contents, true)

if (result.debugOutput) {
  if (!result.triggersMatch) {
    console.log("Triggers do not match")
    console.log("Core result: ", result.debugOutput.triggers.coreResult)
    console.log("Bichard result: ", result.debugOutput.triggers.comparisonResult)
  }

  if (!result.exceptionsMatch) {
    console.log("Exceptions do not match")
    console.log("Core result: ", result.debugOutput.exceptions.coreResult)
    console.log("Bichard result: ", result.debugOutput.exceptions.comparisonResult)
  }

  if (!result.xmlOutputMatches) {
    console.log("XML output from Core does not match")
    console.log(formatXmlDiff(result.debugOutput.xmlOutputDiff))
  }

  if (!result.xmlParsingMatches) {
    console.log("XML parsing does not match")
    console.log(formatXmlDiff(result.debugOutput.xmlParsingDiff))
  }
}

if (result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches) {
  console.log("Comparison matches")
}
