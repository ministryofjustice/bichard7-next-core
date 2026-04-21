import fs from "fs"
import { convertPncJsonToLedsAddDisposalRequest } from "./packages/e2e-test/utils/converters/convertPncJsonToLeds/convertPncJsonToLedsAddDisposalRequest"
import { convertPncJsonToLedsRemandRequest } from "./packages/e2e-test/utils/converters/convertPncJsonToLeds/convertPncJsonToLedsRemandRequest"
import { convertPncJsonToLedsSubsequentDisposalRequest } from "./packages/e2e-test/utils/converters/convertPncJsonToLeds/convertPncJsonToLedsSubsequentDisposalRequest"

import { convertPncXmlToJson } from "./packages/e2e-test/utils/converters/convertPncXmlToJson"
import type {
  PncNormalDisposalJson,
  PncRemandJson,
  PncSubsequentDisposalJson
} from "./packages/e2e-test/utils/converters/convertPncXmlToJson/convertPncXmlToJson"

const run = () => {
  const filePath = "./packages/e2e-test/features/028-driver-disqualification/mock-pnc-responses.ts"
  const fileContent = fs.readFileSync(filePath).toString()
  const regex = /policeApi\.mockUpdate\s*\(\s*"(CXU0\d)"\s*,\s*({[\w\W]*?})\s*\)/g

  const updatedContent = fileContent.replace(regex, (fullMatch: string, code: string, content: string) => {
    try {
      const contentObj = eval(`(${content})`)
    const pncXml = contentObj.expectedRequest
    const pncJson = convertPncXmlToJson(pncXml)

    let mockJson
    switch (code) {
      case "CXU01":
        mockJson = convertPncJsonToLedsRemandRequest(pncJson as PncRemandJson)
        break
      case "CXU02":
        mockJson = convertPncJsonToLedsAddDisposalRequest(pncJson as PncNormalDisposalJson)
        break
      case "CXU04":
      case "CXU03":
        mockJson = convertPncJsonToLedsSubsequentDisposalRequest(pncJson as PncSubsequentDisposalJson)
        break
    }

    const newObject = {
      ...contentObj,
      expectedRequest: mockJson
    }

    return `policeApi.mockUpdate("${code}", ${JSON.stringify(newObject, null, 2)})`
    } catch (err) {
      console.error(err)
      return fullMatch
    }
  })

  fs.writeFileSync(filePath, updatedContent)
  console.log("File updated successfully!");
}

run()
