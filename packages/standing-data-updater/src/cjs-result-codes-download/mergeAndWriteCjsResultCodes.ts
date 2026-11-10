import fs from "node:fs/promises"
import { resultCode as existingCjsResultCodes } from "@moj-bichard7/standing-data"
import type { ResultCode } from "@moj-bichard7/standing-data/types/types"
import { mergeCjsResultCodes } from "./mergeCjsResultCodes"
import { consistentSort } from "../lib/consistentSort"
import { readFile } from "../lib/readFile"

export const mergeAndWriteCjsResultCodes = async () => {
  const newCjsResultCodes = await readFile<ResultCode[]>("../input-data/cjs-result-codes/cjs-result-data.json")
  const mergedData = mergeCjsResultCodes(newCjsResultCodes, existingCjsResultCodes)
  const sortedData = consistentSort(mergedData)
  await fs.writeFile("output-data/data/result-code.json", JSON.stringify(sortedData, null, 2))
}
