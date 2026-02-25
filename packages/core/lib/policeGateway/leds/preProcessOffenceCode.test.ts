import preProcessOffenceCode from "./preProcessOffenceCode"

describe("preProcessOffenceCode", () => {
  it.each([
    { offenceCode: "SX03001A", expectedOffenceCode: "SX03001", expectedRoleQualifier: "AT" },
    { offenceCode: "SX03001B", expectedOffenceCode: "SX03001", expectedRoleQualifier: "AA" },
    { offenceCode: "SX03001C", expectedOffenceCode: "SX03001", expectedRoleQualifier: "C" },
    { offenceCode: "SX03001I", expectedOffenceCode: "SX03001", expectedRoleQualifier: "I" },
    { offenceCode: "SX03001", expectedOffenceCode: "SX03001", expectedRoleQualifier: undefined },
    { offenceCode: "SX03001RANDOM", expectedOffenceCode: "SX03001", expectedRoleQualifier: undefined }
  ])(
    "should return code $expectedOffenceCode and role qualifier $expectedRoleQualifier when offence code is $offenceCode",
    ({ offenceCode, expectedOffenceCode, expectedRoleQualifier }) => {
      const result = preProcessOffenceCode(offenceCode)

      expect(result.offenceCode).toBe(expectedOffenceCode)
      expect(result.roleQualifier).toBe(expectedRoleQualifier)
    }
  )
})
