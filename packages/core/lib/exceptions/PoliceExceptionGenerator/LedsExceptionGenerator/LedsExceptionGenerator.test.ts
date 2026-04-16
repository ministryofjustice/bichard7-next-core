import type { PncException } from "@moj-bichard7/common/types/Exception"

import LedsExceptionGenerator from "./LedsExceptionGenerator"

describe("LedsExceptionGenerator", () => {
  const generator = new LedsExceptionGenerator()
  const asnPath = ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]

  test("generateFromEnquiryMessage should generate exception from enquiry message", () => {
    const message = "No matching arrest reports found for asn: DUMMY_ASN"
    const exception = generator.generateFromEnquiryMessage(message)

    expect(exception).toEqual({
      code: "HO100301",
      message,
      path: asnPath
    })
  })

  test("generateFromUpdateMessage should generate exception from update message", () => {
    const message = "PNC Person ID of the offence retrieved for update does not match supplied ASN"
    const exception = generator.generateFromUpdateMessage(message)

    expect(exception).toEqual({
      code: "HO100401",
      message,
      path: asnPath
    })
  })

  test("isNotFoundError should return true when message is ASN not found", () => {
    const result = generator.isNotFoundError("No matching arrest reports found for asn: DUMMY_ASN_2")

    expect(result).toBe(true)
  })

  test("isNotFoundError should return false when message is not ASN not found", () => {
    const result = generator.isNotFoundError("matching arrest reports found for asn: DUMMY_ASN_2")

    expect(result).toBe(false)
  })

  test("isLockError should return false", () => {
    const result = generator.isLockError({} as PncException)

    expect(result).toBe(false)
  })
})
