// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import type { Change } from "diff"
import { diffLines } from "diff"
import { pd } from "pretty-data"

export const xmlOutputDiff = (value1: string, value2: string): Change[] =>
  diffLines(pd.xml(value1.trim()), pd.xml(value2.trim()))

export const xmlOutputMatches = (value1: string, value2: string): boolean =>
  xmlOutputDiff(value1, value2).filter((d) => d.added || d.removed).length === 0

const truncateUnchanged = (change: Change): Change => {
  if (change.added || change.removed || (change.count && change.count <= 11)) {
    return change
  }

  const lines = change.value.split("\n")

  return {
    count: 11,
    value: [...lines.slice(0, 5), "...", ...lines.slice(-5)].join("\n")
  }
}

export const formatXmlDiff = (changes: Change[], truncate = false): string =>
  changes
    .map((c) => (truncate ? truncateUnchanged(c) : c))
    .map((change) => {
      const color = change.added ? "green" : change.removed ? "red" : "grey"
      return chalk[color](change.value)
    })
    .join("")

export const formatXmlDiffAsTxt = (changes: Change[], truncate = false): string =>
  changes
    .map((c) => (truncate ? truncateUnchanged(c) : c))
    .map((change) => {
      const prefix = change.added ? "+" : change.removed ? "-" : " "
      return `${prefix} ${change.value}`
    })
    .join("")
