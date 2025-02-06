import { isError } from "@moj-bichard7/common/types/Result"

import preProcessAsn from "./preProcessAsn"

describe("preProcessAsn", () => {
  it("should return error if ASN is less than 20 characters", () => {
    const asn = "9825FD0012345678912"

    const processedAsn = preProcessAsn(asn)

    expect(isError(processedAsn)).toBeTruthy()
    expect((processedAsn as Error).message).toBe("Invalid ASN length. Length is 19")
  })

  it("should return error if ASN is more than 21 characters", () => {
    const asn = "98125FD0012345678912XX"

    const processedAsn = preProcessAsn(asn)

    expect(isError(processedAsn)).toBeTruthy()
    expect((processedAsn as Error).message).toBe("Invalid ASN length. Length is 22")
  })

  it("should process 21 character long ASN", () => {
    const asn = "221FD112200001234560X"
    const expectedAsn = "22/FD11/22/1234560X"

    const processedAsn = preProcessAsn(asn)

    expect(processedAsn).toBe(expectedAsn)
  })

  it("should process 20 character long ASN", () => {
    const asn = "22FD112200001234560X"
    const expectedAsn = "22/FD11/22/1234560X"

    const processedAsn = preProcessAsn(asn)

    expect(processedAsn).toBe(expectedAsn)
  })
})
