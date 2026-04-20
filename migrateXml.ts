import fs from "fs"
import { convertPncJsonToLedsAddDisposalRequest } from "./packages/e2e-test/utils/converters/convertPncJsonToLeds/convertPncJsonToLedsAddDisposalRequest"
import { convertPncXmlToJson } from "./packages/e2e-test/utils/converters/convertPncXmlToJson"
import type { PncNormalDisposalJson } from "./packages/e2e-test/utils/converters/convertPncXmlToJson/convertPncXmlToJson"

const run = () => {
  const file = fs
    .readFileSync("./packages/e2e-test/features/028-driver-disqualification/mock-pnc-responses.ts")
    .toString()
  const regex = /policeApi\.mockUpdate\s*\(\s*"(CXU0\d)"\s*,\s*({[\w\W]*?})\s*\)/g
  const allMatches = [...file.matchAll(regex)]

  allMatches.forEach((match) => {
    let mockJson
    const code = match[1]
    const contentObj = eval(`(${match[2]})`)
    const pncXml = contentObj.expectedRequest
    const pncJson = convertPncXmlToJson(pncXml)

    if (code === "CXU02") {
      mockJson = convertPncJsonToLedsAddDisposalRequest(pncJson as PncNormalDisposalJson)
    }

    console.log("======>", JSON.stringify(mockJson, null, 2))
  })
}

run()
