import type { DisposalResult } from "../../../../types/leds/AddDisposalRequest"

import shouldExcludePleaAndAdjudication from "./shouldExcludePleaAndAdjudication"

describe("shouldExcludePleaAndAdjudication", () => {
  it("should return true when case is carried forward or referred to court case and 2059 disposal code exists", () => {
    const disposalResults = [{ disposalCode: 2059 }] as DisposalResult[]
    const isCarriedForwardOrReferredToCourtCase = true

    const result = shouldExcludePleaAndAdjudication(disposalResults, isCarriedForwardOrReferredToCourtCase)

    expect(result).toBe(true)
  })

  it("should return true when case is carried forward or referred to court case and 2060 disposal code exists", () => {
    const disposalResults = [{ disposalCode: 2060 }] as DisposalResult[]
    const isCarriedForwardOrReferredToCourtCase = true

    const result = shouldExcludePleaAndAdjudication(disposalResults, isCarriedForwardOrReferredToCourtCase)

    expect(result).toBe(true)
  })

  it("should return false when case is not carried forward or referred to court case and 2059 disposal code exists", () => {
    const disposalResults = [{ disposalCode: 2059 }] as DisposalResult[]
    const isCarriedForwardOrReferredToCourtCase = false

    const result = shouldExcludePleaAndAdjudication(disposalResults, isCarriedForwardOrReferredToCourtCase)

    expect(result).toBe(false)
  })

  it("should return false when case is not carried forward or referred to court case and 2060 disposal code exists", () => {
    const disposalResults = [{ disposalCode: 2060 }] as DisposalResult[]
    const isCarriedForwardOrReferredToCourtCase = false

    const result = shouldExcludePleaAndAdjudication(disposalResults, isCarriedForwardOrReferredToCourtCase)

    expect(result).toBe(false)
  })

  it("should return false when case is carried forward or referred to court case and a random disposal code exists", () => {
    const disposalResults = [{ disposalCode: 1015 }] as DisposalResult[]
    const isCarriedForwardOrReferredToCourtCase = true

    const result = shouldExcludePleaAndAdjudication(disposalResults, isCarriedForwardOrReferredToCourtCase)

    expect(result).toBe(false)
  })
})
