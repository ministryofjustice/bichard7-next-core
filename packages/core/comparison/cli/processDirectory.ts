import fs from "fs"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import processFile from "./processFile"
import type { SkippedFile } from "./processRange"

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
