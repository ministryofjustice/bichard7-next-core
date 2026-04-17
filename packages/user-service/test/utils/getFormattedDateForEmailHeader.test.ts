import { getFormattedDateForEmailHeader } from "../utils/getFormattedDateForEmailHeader"

describe("getFormattedDateForEmailHeader", () => {
  it("formats correctly for BST (Summer)", () => {
    const summerDate = new Date("2026-04-17T16:40:00Z")
    const result = getFormattedDateForEmailHeader(summerDate)

    expect(result).toBe("Fri, 17 Apr 2026 16:40:00 +0100")
  })

  it("formats correctly for GMT (Winter)", () => {
    const winterDate = new Date("2026-03-01T12:00:00Z")
    const result = getFormattedDateForEmailHeader(winterDate)

    expect(result).toBe("Sun, 01 Mar 2026 12:00:00 +0000")
  })
})
