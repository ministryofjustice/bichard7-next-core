import fs from "fs"
import { convertPncJsonToLedsAsnQueryResponse } from "./packages/e2e-test/utils/converters/convertPncJsonToLeds/convertPncJsonToLedsAsnQueryResponse"

import { convertPncXmlToJson } from "./packages/e2e-test/utils/converters/convertPncXmlToJson"
import type { PncAsnQueryJson } from "./packages/e2e-test/utils/converters/convertPncXmlToJson/convertPncXmlToJson"

const processFile = (filePath: string) => {
  console.log(`Processing: ${filePath}`)
  const fileContent = fs.readFileSync(filePath).toString()
  const regex = /(policeApi\.mockAsnQuery\([\s\S]*?response:\s*`)([\s\S]*?)(`)/g

  const updatedContent = fileContent.replace(
    regex,
    (fullMatch: string, prefix: string, content: string, suffix: string) => {
      try {
        const pncJson = convertPncXmlToJson(content)
        const params = { asn: "", personId: "", reportId: "", courtCaseId: "" }
        const mockJson = convertPncJsonToLedsAsnQueryResponse(pncJson as PncAsnQueryJson, params)

        return `${prefix}${mockJson}${suffix}`
      } catch (err) {
        console.log(err)
        return fullMatch
      }
    }
  )

  fs.writeFileSync(filePath, updatedContent)
}

const run = () => {
  const rootDir = "./packages/e2e-test/features"
  const files = fs.readdirSync(rootDir, { recursive: true }) as string[]

  const targetFiles = files.filter((file) => file.endsWith("mock-pnc-responses.ts")).map((file) => `${rootDir}/${file}`)

  targetFiles.forEach(processFile)
  console.log(`Finished! processed ${targetFiles.length} files.`)
}

run()
