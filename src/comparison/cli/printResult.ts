import type { ComparisonResult } from "src/comparison/compare"
// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import { formatXmlDiff } from "src/comparison/xmlOutputComparison"

const resultMatches = (result: ComparisonResult): boolean =>
  result.exceptionsMatch && result.triggersMatch && result.xmlOutputMatches && result.xmlParsingMatches

const toPercent = (quotient: number, total: number): string => `${((quotient / total) * 100).toFixed(1)}%`

const printSummary = (results: ComparisonResult[]): void => {
  const total = results.length
  const passed = results.filter((result) => resultMatches(result)).length
  const failed = total - passed

  console.log("\nSummary:")
  console.log(`${results.length} comparisons`)

  if (passed > 0) {
    console.log(chalk.green(`✓ ${passed} passed (${toPercent(passed, total)})`))
  }

  if (failed > 0) {
    console.log(chalk.red(`✗ ${failed} failed (${toPercent(failed, total)})`))
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

const printResult = (result: ComparisonResult | ComparisonResult[], truncate = false): void => {
  if (Array.isArray(result)) {
    result.forEach((r) => printResult(r, truncate))
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
      console.log(formatXmlDiff(result.debugOutput.xmlOutputDiff, truncate))
    }

    if (!result.xmlParsingMatches) {
      console.log("XML parsing does not match")
      console.log(formatXmlDiff(result.debugOutput.xmlParsingDiff, truncate))
    }
  }
}

export default printResult
