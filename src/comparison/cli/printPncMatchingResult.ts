// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import type PncComparisonResultDetail from "../types/PncComparisonResultDetail"

const toPercent = (quotient: number, total: number): string => `${((quotient / total) * 100).toFixed(2)}%`

const printSummary = (results: PncComparisonResultDetail[]): void => {
  const total = results.length
  const attemptedMatch = results.filter((result) => !!result.expected)
  const passed = attemptedMatch.filter((result) => result.pass).length
  const failed = attemptedMatch.length - passed

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
  console.log(`\n${result.file}`)
  console.log("Expected:")
  console.log(JSON.stringify(result.expected, null, 2))
  console.log("Actual:")
  console.log(JSON.stringify(result.actual, null, 2))
  console.log(formatTest("Pnc Matching", result.pass))
}

const printPncMatchingResult = (
  result?: PncComparisonResultDetail | PncComparisonResultDetail[],
  truncate = false
): void => {
  if (!result) {
    return
  }
  if (Array.isArray(result)) {
    result.forEach((r) => printPncMatchingResult(r, truncate))
    printSummary(result)
    return
  }

  if (!result.pass) {
    console.log(`\nProcessing file:\n${result.file}\n`)
    printSingleSummary(result)
  }
}

export default printPncMatchingResult
