import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import errorPaths from "../../lib/exceptions/errorPaths"
import generatePncUpdateExceptionFromMessage from "./generatePncUpdateExceptionFromMessage"

describe("generatePncUpdateExceptionFromMessage", () => {
  it.each([
    ["I0007", ExceptionCode.HO100401],
    ["I0008", ExceptionCode.HO100401],
    ["I0013", ExceptionCode.HO100401],
    ["I0014", ExceptionCode.HO100401],
    ["I0015", ExceptionCode.HO100401],
    ["I0021", ExceptionCode.HO100401],
    ["I0022", ExceptionCode.HO100401],
    ["I0023", ExceptionCode.HO100401],
    ["I0031", ExceptionCode.HO100401],
    ["I0033", ExceptionCode.HO100401],
    ["I0036", ExceptionCode.HO100401],
    ["I0212", ExceptionCode.HO100401],
    ["I0256", ExceptionCode.HO100401],
    ["I0001", ExceptionCode.HO100402],
    ["I0003", ExceptionCode.HO100402],
    ["I0005", ExceptionCode.HO100402],
    ["I0017", ExceptionCode.HO100402],
    ["I0024", ExceptionCode.HO100402],
    ["I0030", ExceptionCode.HO100402],
    ["I1001", ExceptionCode.HO100402],
    ["I1020", ExceptionCode.HO100402],
    ["I1041", ExceptionCode.HO100402],
    ["I5001", ExceptionCode.HO100403],
    ["I5500", ExceptionCode.HO100403],
    ["I5999", ExceptionCode.HO100403],
    ["PNCAM", ExceptionCode.HO100404],
    ["PNCUE", ExceptionCode.HO100404],
    ["I6001", ExceptionCode.HO100404],
    ["I6002", ExceptionCode.HO100404],
    ["IXXXX", ExceptionCode.HO100402]
  ])("with code: %s should generate exception: %s", (errorCode: string, code: ExceptionCode) => {
    const message = `${errorCode} - a message`

    const exception = generatePncUpdateExceptionFromMessage(message)

    expect(exception).toStrictEqual({
      code,
      path: errorPaths.case.asn,
      message
    })
  })
})
