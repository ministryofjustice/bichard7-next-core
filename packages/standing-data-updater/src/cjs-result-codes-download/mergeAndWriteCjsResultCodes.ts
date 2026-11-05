import * as fs from "fs"
import mergeCjsResultCodes from "./mergeCjsResultCodes"
import newCjsResultCodes from "../../input-data/cjs-result-codes/cjs-result-data.json"
import existingCjsResultCodes from "../../output-data/data/result-code.json"
import consistentSort from "../lib/consistentSort"

const mergeAndWriteCjsResultCodes = async () => {
  const mergedData = mergeCjsResultCodes(newCjsResultCodes, existingCjsResultCodes)
  const sortedData = consistentSort(mergedData)
  await fs.promises.writeFile("output-data/data/result-code.json", JSON.stringify(sortedData, null, 2))
}

export default mergeAndWriteCjsResultCodes
