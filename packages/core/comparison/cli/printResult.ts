// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import { formatXmlDiff } from "../lib/xmlOutputComparison"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import getComparisonResultStatistics from "./getComparisonStatistics"
import printList from "./printList"
import type { SkippedFile } from "./processRange"

export const resultMatches = (result: ComparisonResultDetail): boolean =>
  result.exceptionsMatch &&
  result.triggersMatch &&
  result.xmlOutputMatches &&
  result.xmlParsingMatches &&
  result.auditLogEventsMatch

const toPercent = (quotient: number, total: number): string => `${((quotient / total) * 100).toFixed(2)}%`

const printSummary = (results: (ComparisonResultDetail | SkippedFile)[]): void => {
  const stats = getComparisonResultStatistics(results)

  console.log("\nSummary:")
  console.log(`${stats.total} comparisons`)

  if (stats.passed > 0) {
    console.log(
      chalk.green(
        `✓ ${stats.passed} passed (${toPercent(stats.passed, stats.expectedPassed)}) (of which AHOs: ${toPercent(
          stats.passedAho,
          stats.expectedPassedAho
        )} of ${stats.expectedPassedAho} and PncUpdateDatasets: ${toPercent(
          stats.passedPncUpdateDataset,
          stats.expectedPassedPncUpdateDataset
        )} of ${stats.expectedPassedPncUpdateDataset})`
      )
    )
  }

  if (stats.failed > 0) {
    console.log(chalk.red(`✗ ${stats.failed} failed (${toPercent(stats.failed, stats.expectedPassed)})`))
  }

  if (stats.skipped > 0) {
    console.log(chalk.yellow(`○ ${stats.skipped} skipped`))
  }

  if (stats.intentional > 0) {
    console.log(chalk.yellow(`○ ${stats.intentional} intentional differences skipped`))
  }

  if (stats.errored > 0) {
    console.log(chalk.bgRed(`● ${stats.errored} errored (${toPercent(stats.errored, stats.expectedPassed)})`))
  }
}

const formatTest = (name: string, success: boolean): string => {
  if (success) {
    return `${chalk.green("✓")} ${name} passed`
  }

  return `${chalk.red("✗")} ${name} failed`
}

export const printSingleSummary = (result: ComparisonResultDetail): void => {
  console.log(formatTest("Audit log events", result.auditLogEventsMatch))
  console.log(formatTest("Triggers", result.triggersMatch))
  console.log(formatTest("Exceptions", result.exceptionsMatch))
  console.log(formatTest("XML Output", result.xmlOutputMatches))
  console.log(formatTest("XML Parsing", result.xmlParsingMatches))
}

const printResult = (
  result?: (ComparisonResultDetail | SkippedFile) | (ComparisonResultDetail | SkippedFile)[],
  truncate = false,
  list = false
): boolean => {
  if (!result) {
    return false
  }

  if (list) {
    return printList(result)
  }

  if (Array.isArray(result)) {
    const results = result.map((r) => printResult(r, truncate))
    printSummary(result)
    return results.every((res) => res)
  }

  if (result.skipped) {
    return true
  }

  if (result.error) {
    console.error(`\n${result.incomingMessageType} file threw an error!\n${result.file}\n`)
    console.error(result.error)
    return false
  }

  if (!resultMatches(result)) {
    console.log(`\nProcessing incoming ${result.incomingMessageType} file:\n${result.file}\n`)
  }

  if (result.debugOutput) {
    if (!result.auditLogEventsMatch) {
      console.log("Audit log events do not match")
      console.log("Core result: ", result.debugOutput.auditLogEvents.coreResult)
      console.log("Bichard result: ", result.debugOutput.auditLogEvents.comparisonResult)
    }

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
    return false
  }

  return true
}

export default printResult
