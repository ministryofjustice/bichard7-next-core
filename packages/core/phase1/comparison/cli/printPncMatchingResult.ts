// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import type PncComparisonResultDetail from "phase1/comparison/types/PncComparisonResultDetail"
import type { SkippedFile } from "./processRange"

const toPercent = (quotient: number, total: number): string => `${((quotient / total) * 100).toFixed(2)}%`

const printSummary = (results: (PncComparisonResultDetail | SkippedFile)[]): void => {
  const total = results.length
  const attemptedMatch = results.filter((result) => "expected" in result && !!result.expected)
  const passed = attemptedMatch.filter((result) => "pass" in result && result.pass).length
  const skipped = results.filter((result) => "skipped" in result).length
  const failed = attemptedMatch.length - passed - skipped

  console.log("\nSummary:")
  console.log(`${total} comparisons in total`)
  console.log(`${attemptedMatch.length} results matched to PNC`)

  if (passed > 0) {
    console.log(chalk.green(`✓ ${passed} passed (${toPercent(passed, attemptedMatch.length)})`))
  }

  if (failed > 0) {
    console.log(chalk.red(`✗ ${failed} failed (${toPercent(failed, attemptedMatch.length)})`))
  }
}

const formatTest = (name: string, success: boolean): string => {
  if (success) {
    return `${chalk.green("✓")} ${name} passed`
  }
  return `${chalk.red("✗")} ${name} failed`
}

export const printSingleSummary = (result: PncComparisonResultDetail): void => {
  console.log("Expected:")
  console.log(JSON.stringify(result.expected, null, 2))
  console.log("Actual:")
  console.log(JSON.stringify(result.actual, null, 2))
  console.log(formatTest("Pnc Matching", result.pass))
}

const printPncMatchingResult = (
  result?: (PncComparisonResultDetail | SkippedFile) | (PncComparisonResultDetail | SkippedFile)[],
  truncate = false
): boolean => {
  if (!result) {
    return false
  }
  if (Array.isArray(result)) {
    const results = result.map((r) => printPncMatchingResult(r, truncate))
    printSummary(result)
    return results.every((res) => res)
  }

  if ("pass" in result && !result.pass) {
    console.log(`\nProcessing file:\n${result.file}\n`)
    printSingleSummary(result)
    return false
  }
  return true
}

export default printPncMatchingResult
