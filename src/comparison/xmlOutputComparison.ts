// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk"
import type { Change } from "diff"
import { diffLines } from "diff"
import { pd } from "pretty-data"

export const xmlOutputDiff = (value1: string, value2: string): Change[] =>
  diffLines(pd.xml(value1.trim()), pd.xml(value2.trim()))

export const xmlOutputMatches = (value1: string, value2: string): boolean =>
  xmlOutputDiff(value1, value2).filter((d) => d.added || d.removed).length === 0

export const formatXmlDiff = (changes: Change[]): string =>
  changes
    .map((change) => {
      const color = change.added ? "green" : change.removed ? "red" : "grey"
      return chalk[color](change.value)
    })
    .join("")
