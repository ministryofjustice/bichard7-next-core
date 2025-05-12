import fs from "fs"

import processTestFile from "../../../comparison/lib/processTestFile"

const getComparisonTests = <ComparisonFile>(phase: 1 | 2 | 3, ignored: string[] = []): ComparisonFile[] => {
  const filePath = `phase${phase}/tests/fixtures/e2e-comparison`
  const filter = process.env.FILTER_TEST

  return fs
    .readdirSync(filePath)
    .filter((name) => {
      if (filter) {
        return name.includes(`test-${filter}`)
      } else {
        return !ignored.some((testNumber) => name.includes(`test-${testNumber}`))
      }
    })
    .map((name) => `${filePath}/${name}`)
    .map(processTestFile) as ComparisonFile[]
}

export default getComparisonTests
