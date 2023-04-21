// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import { formatXmlDiff } from "../lib/xmlOutputComparison"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { SkippedFile } from "./processRange"

const resultMatches = (result: ComparisonResultDetail): boolean =>
  result.exceptionsMatch && result.triggersMatch && result.xmlOutputMatches && result.xmlParsingMatches

const toPercent = (quotient: number, total: number): string => `${((quotient / total) * 100).toFixed(2)}%`

const printSummary = (results: (ComparisonResultDetail | SkippedFile)[]): void => {
  const total = results.length
  const passed = results.filter(
    (result) => !result.skipped && !result.intentionalDifference && resultMatches(result)
  ).length
  const skipped = results.filter((result) => result.skipped && !result.intentionalDifference).length
  const errored = results.filter((result) => "error" in result && result.error).length
  const intentional = results.filter(
    (result) => "intentionalDifference" in result && result.intentionalDifference
  ).length
  const failed = total - passed - skipped - errored - intentional

  console.log("\nSummary:")
  console.log(`${results.length} comparisons`)

  if (passed > 0) {
    console.log(chalk.green(`✓ ${passed} passed (${toPercent(passed, total - skipped - intentional)})`))
  }

  if (failed > 0) {
    console.log(chalk.red(`✗ ${failed} failed (${toPercent(failed, total - skipped - intentional)})`))
  }

  if (skipped > 0) {
    console.log(chalk.yellow(`○ ${skipped} skipped`))
  }

  if (intentional > 0) {
    console.log(chalk.yellow(`○ ${intentional} intentional differences skipped`))
  }

  if (errored > 0) {
    console.log(chalk.bgRed(`● ${errored} errored (${toPercent(errored, total - skipped - intentional)})`))
  }
}

const formatTest = (name: string, success: boolean): string => {
  if (success) {
    return `${chalk.green("✓")} ${name} passed`
  }
  return `${chalk.red("✗")} ${name} failed`
}

export const printSingleSummary = (result: ComparisonResultDetail): void => {
  console.log(`\n${result.file}`)
  console.log(formatTest("Triggers", result.triggersMatch))
  console.log(formatTest("Exceptions", result.exceptionsMatch))
  console.log(formatTest("XML Output", result.xmlOutputMatches))
  console.log(formatTest("XML Parsing", result.xmlParsingMatches))
}

const printResult = (
  result?: (ComparisonResultDetail | SkippedFile) | (ComparisonResultDetail | SkippedFile)[],
  truncate = false
): void => {
  if (!result) {
    return
  }
  if (Array.isArray(result)) {
    result.forEach((r) => printResult(r, truncate))
    printSummary(result)
    return
  }

  if (result.skipped) {
    console.log(`\nSkipping file:\n${result.file}\n`)
    return
  }

  if (result.error) {
    console.error(`\nFile threw an error!\n${result.file}\n`)
    console.error(result.error)
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

  if (!resultMatches(result)) {
    printSingleSummary(result)
  }
}

export default printResult
