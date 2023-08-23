import fs from "fs"
import type ComparisonResultDetail from "phase1/comparison/types/ComparisonResultDetail"
import processFile from "phase1/comparison/cli/processFile"
import type { SkippedFile } from "phase1/comparison/cli/processRange"

const processDirectory = async (directory: string): Promise<(ComparisonResultDetail | SkippedFile)[]> => {
  const results: (ComparisonResultDetail | SkippedFile)[] = []

  const allFiles = fs.readdirSync(directory).map((f) => `${directory}/${f}`)

  for (const file of allFiles) {
    const contents = fs.readFileSync(file)
    const result = await processFile(contents.toString(), file, new Date())
    if (result) {
      results.push(result)
    }
  }

  return results
}

export default processDirectory
