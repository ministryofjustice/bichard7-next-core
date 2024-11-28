import generatePncEnquiryExceptionFromMessage from "./generatePncEnquiryExceptionFromMessage"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"

describe("generatePncEnquiryExceptionFromMessage", () => {
  it("returns a HO100301 exception for a 'not found' error", () => {
    const message = "I1008 ARREST/SUMMONS REF ABC123 NOT FOUND"

    const exception = generatePncEnquiryExceptionFromMessage(message)

    expect(exception).toStrictEqual({
      code: ExceptionCode.HO100301,
      path: errorPaths.case.asn,
      message
    })
  })

  it.each([
    ["I0013", ExceptionCode.HO100301],
    ["I0020", ExceptionCode.HO100301],
    ["I0022", ExceptionCode.HO100301],
    ["PNCAM", ExceptionCode.HO100302],
    ["PNCUE", ExceptionCode.HO100302],
    ["I0208", ExceptionCode.HO100313],
    ["I0209", ExceptionCode.HO100313],
    ["I0212", ExceptionCode.HO100313],
    ["I0256", ExceptionCode.HO100313],
    ["I0007", ExceptionCode.HO100314],
    ["I0008", ExceptionCode.HO100314],
    ["I0023", ExceptionCode.HO100314],
    ["I0031", ExceptionCode.HO100314],
    ["I0034", ExceptionCode.HO100314],
    ["I0036", ExceptionCode.HO100314],
    ["I0034", ExceptionCode.HO100314],
    ["I1001", ExceptionCode.HO100314],
    ["I1030", ExceptionCode.HO100314],
    ["I1041", ExceptionCode.HO100314],
    ["I6001", ExceptionCode.HO100314],
    ["I6002", ExceptionCode.HO100314],
    ["I5001", ExceptionCode.HO100315],
    ["I5500", ExceptionCode.HO100315],
    ["I5999", ExceptionCode.HO100315],
    ["IXXXX", ExceptionCode.HO100314]
  ])("with code: %s should generate exception: %s", (errorCode: string, code: ExceptionCode) => {
    const message = `${errorCode} - a message`

    const exception = generatePncEnquiryExceptionFromMessage(message)

    expect(exception).toStrictEqual({
      code,
      path: errorPaths.case.asn,
      message
    })
  })
})
