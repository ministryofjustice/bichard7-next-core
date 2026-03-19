import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import generateLedsEnquiryExceptionFromMessage from "./generateLedsEnquiryExceptionFromMessage"

describe("generateLedsEnquiryExceptionFromMessage", () => {
  it.each([
    {
      message: "No matching arrest reports found for asn: 26/0000/00/00000001458F",
      expectedCode: ExceptionCode.HO100301
    },
    {
      message: "dummy message",
      expectedCode: ExceptionCode.HO100314
    },
    {
      message: "",
      expectedCode: ExceptionCode.HO100314
    }
  ])('should return exception $expectedCode when message is "$message"', ({ message, expectedCode }) => {
    const expectedPath = [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "ArrestSummonsNumber"
    ]

    const exception = generateLedsEnquiryExceptionFromMessage(message)
    const exceptionForLowercaseMessage = generateLedsEnquiryExceptionFromMessage(message.toLowerCase())
    const exceptionForUppercaseMessage = generateLedsEnquiryExceptionFromMessage(message.toUpperCase())

    expect(exception).toEqual({
      code: expectedCode,
      message,
      path: expectedPath
    })
    expect(exceptionForLowercaseMessage).toEqual({
      code: expectedCode,
      message: message.toLowerCase(),
      path: expectedPath
    })
    expect(exceptionForUppercaseMessage).toEqual({
      code: expectedCode,
      message: message.toUpperCase(),
      path: expectedPath
    })
  })
})
