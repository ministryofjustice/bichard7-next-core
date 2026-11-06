import type { ResultCode } from "@moj-bichard7/standing-data/types/types"
import mergeCjsResultCodes from "./mergeCjsResultCodes"

describe("MergeCjsResultCodes", () => {
  it("Merges the downloaded cjs result codes with the existing ones", () => {
    const newData: ResultCode[] = [
      {
        cjsCode: "1001",
        description: "Death",
        recordableOnPnc: "",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "72",
        type: "F"
      },
      {
        cjsCode: "1002",
        description: "Imprisonment",
        recordableOnPnc: "",
        resultCodeQualifiers: "AB",
        resultHalfLifeHours: "72",
        type: "F"
      }
    ]

    const existingData: ResultCode[] = [
      {
        cjsCode: "1003",
        description: "Detained during HM Pleasure",
        recordableOnPnc: "",
        resultCodeQualifiers: "AJ",
        resultHalfLifeHours: "72",
        type: "F"
      },
      {
        cjsCode: "1004",
        description: "Restriction Order",
        recordableOnPnc: "",
        resultCodeQualifiers: "AV",
        resultHalfLifeHours: "72",
        type: "F"
      }
    ]

    const expectedData: ResultCode[] = [
      {
        cjsCode: "1003",
        description: "Detained during HM Pleasure",
        recordableOnPnc: "",
        resultCodeQualifiers: "AJ",
        resultHalfLifeHours: "72",
        type: "F"
      },
      {
        cjsCode: "1004",
        description: "Restriction Order",
        recordableOnPnc: "",
        resultCodeQualifiers: "AV",
        resultHalfLifeHours: "72",
        type: "F"
      },
      {
        cjsCode: "1001",
        description: "Death",
        recordableOnPnc: "",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "72",
        type: "F"
      },
      {
        cjsCode: "1002",
        description: "Imprisonment",
        recordableOnPnc: "",
        resultCodeQualifiers: "AB",
        resultHalfLifeHours: "72",
        type: "F"
      }
    ]

    const mergedData = mergeCjsResultCodes(newData, existingData)
    expect(mergedData).toEqual(expectedData)
  })

  it("Does not create duplicate entries", () => {
    const newData: ResultCode[] = [
      {
        cjsCode: "1001",
        description: "Uncoded text result",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "",
        type: "F"
      },
      {
        cjsCode: "1002",
        description: "Imprisonment",
        recordableOnPnc: "",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "72",
        type: "F"
      }
    ]

    const existingData: ResultCode[] = [
      {
        cjsCode: "1002",
        description: "Imprisonment",
        recordableOnPnc: "",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "72",
        type: "F"
      },
      {
        cjsCode: "1003",
        description: "Detained during HM Pleasure",
        recordableOnPnc: "",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "72",
        type: "F"
      }
    ]

    const expectedData: ResultCode[] = [
      {
        cjsCode: "1002",
        description: "Imprisonment",
        recordableOnPnc: "",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "72",
        type: "F"
      },
      {
        cjsCode: "1003",
        description: "Detained during HM Pleasure",
        recordableOnPnc: "",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "72",
        type: "F"
      },
      {
        cjsCode: "1001",
        description: "Uncoded text result",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "",
        type: "F"
      }
    ]

    const mergedData = mergeCjsResultCodes(newData, existingData)
    expect(mergedData).toEqual(expectedData)
  })

  it("Overwrites existing result codes with values from new data", () => {
    const newData: ResultCode[] = [
      {
        cjsCode: "1001",
        description: "Uncoded text result",
        recordableOnPnc: "",
        resultCodeQualifiers: "F,FH,YP,YQ,YT,C",
        resultHalfLifeHours: "72",
        type: ""
      }
    ]

    const existingData: ResultCode[] = [
      {
        cjsCode: "1001",
        description: "Imprisonment",
        recordableOnPnc: "",
        resultCodeQualifiers: "",
        resultHalfLifeHours: "",
        type: "F"
      }
    ]

    const expectedData: ResultCode[] = [
      {
        cjsCode: "1001",
        description: "Uncoded text result",
        recordableOnPnc: "",
        resultCodeQualifiers: "F,FH,YP,YQ,YT,C",
        resultHalfLifeHours: "72",
        type: ""
      }
    ]

    const mergedData = mergeCjsResultCodes(newData, existingData)
    expect(mergedData).toEqual(expectedData)
  })
})
