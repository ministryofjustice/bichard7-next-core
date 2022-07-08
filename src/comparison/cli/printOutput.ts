import type { ComparisonResult } from "src/comparison/compare"
// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import { formatXmlDiff } from "src/comparison/xmlOutputComparison"

const resultMatches = (result: ComparisonResult): boolean =>
  result.exceptionsMatch && result.triggersMatch && result.xmlOutputMatches && result.xmlParsingMatches

const printSummary = (results: ComparisonResult[]): void => {
  const passed = results.filter((result) => resultMatches(result))
  console.log("\nSummary:")
  console.log(`${results.length} comparisons`)
  if (passed.length > 0) {
    console.log(chalk.green(`✓ ${passed.length} passed`))
  }
  if (results.length - passed.length > 0) {
    console.log(chalk.red(`✗ ${results.length - passed.length} failed`))
  }
}

const formatTest = (name: string, success: boolean): string => {
  if (success) {
    return `${chalk.green("✓")} ${name} passed`
  }
  return `${chalk.red("✗")} ${name} failed`
}

export const printSingleSummary = (result: ComparisonResult): void => {
  console.log(`\n${result.file}`)
  console.log(formatTest("Triggers", result.triggersMatch))
  console.log(formatTest("Exceptions", result.exceptionsMatch))
  console.log(formatTest("XML Output", result.xmlOutputMatches))
  console.log(formatTest("XML Parsing", result.xmlParsingMatches))
}

const printResult = (result: ComparisonResult | ComparisonResult[]): void => {
  if (Array.isArray(result)) {
    result.forEach(printResult)
    result.forEach(printSingleSummary)
    printSummary(result)
    return
  }

  if (!resultMatches(result)) {
    console.log(`\nProcessing file:\n${result.file}\n`)
  }
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
}

export default printResult
