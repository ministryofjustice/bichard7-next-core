import fs from "fs"

import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { SkippedFile } from "./processRange"

import getFile from "../lib/getFile"
import processFile from "./processFile"

const processFilelist = async (filelist: string, cache: boolean): Promise<(ComparisonResultDetail | SkippedFile)[]> => {
  const results: (ComparisonResultDetail | SkippedFile)[] = []

  const files = String(fs.readFileSync(filelist))
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => !!l)

  for (const file of files) {
    const contents = await getFile(file, cache)
    const result = await processFile(contents.toString(), file, new Date())
    if (result) {
      results.push(result)
    }
  }

  return results
}

export default processFilelist
