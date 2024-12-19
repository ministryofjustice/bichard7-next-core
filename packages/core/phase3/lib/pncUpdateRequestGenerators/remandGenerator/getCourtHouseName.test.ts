import type { Hearing, Result } from "../../../../types/AnnotatedHearingOutcome"

import getCourtHouseName from "./getCourtHouseName"

const datedWarrantIssuedResultCode = 4575
const undatedWarrantIssuedResultCode = 4576
const hearing = {
  CourtHouseName: "Dummy house name"
} as Hearing

describe("getCourtHouseName", () => {
  describe("when 1st instance result qualifier exists", () => {
    it("should return 1st instance warrant issued text when undated warrant is issued", () => {
      const results = [
        { CJSresultCode: undatedWarrantIssuedResultCode, ResultQualifierVariable: [] },
        { CJSresultCode: 2650, ResultQualifierVariable: [{ Code: "LE" }] }
      ] as Result[]

      const courtHouseName = getCourtHouseName(hearing, results)

      expect(courtHouseName).toBe("*****1ST INSTANCE WARRANT ISSUED*****")
    })

    it("should return 1st instance dated warrant issued text when dated warrant is issued", () => {
      const results = [
        { CJSresultCode: datedWarrantIssuedResultCode, ResultQualifierVariable: [] },
        { CJSresultCode: 2650, ResultQualifierVariable: [{ Code: "LE" }] }
      ] as Result[]

      const courtHouseName = getCourtHouseName(hearing, results)

      expect(courtHouseName).toBe("*****1ST INSTANCE DATED WARRANT ISSUED*****")
    })

    it("should return the court house name from the hearing outcome when no warrants are issued", () => {
      const results = [
        { CJSresultCode: 2651, ResultQualifierVariable: [] },
        { CJSresultCode: 2650, ResultQualifierVariable: [{ Code: "LE" }] }
      ] as Result[]

      const courtHouseName = getCourtHouseName(hearing, results)

      expect(courtHouseName).toBe("Dummy house name")
    })
  })

  describe("when 1st instance result qualifier does not exist", () => {
    it("should return failed to appear text when undated warrant is issued", () => {
      const results = [
        { CJSresultCode: undatedWarrantIssuedResultCode, ResultQualifierVariable: [] },
        { CJSresultCode: 2650, ResultQualifierVariable: [{ Code: "LB" }] }
      ] as Result[]

      const courtHouseName = getCourtHouseName(hearing, results)

      expect(courtHouseName).toBe("*****FAILED TO APPEAR*****")
    })

    it("should return failed to appear dated warrant text when dated warrant is issued", () => {
      const results = [
        { CJSresultCode: datedWarrantIssuedResultCode, ResultQualifierVariable: [] },
        { CJSresultCode: 2650, ResultQualifierVariable: [{ Code: "LB" }] }
      ] as Result[]

      const courtHouseName = getCourtHouseName(hearing, results)

      expect(courtHouseName).toBe("***** FTA DATED WARRANT *****")
    })

    it("should return the court house name from the hearing outcome when no warrants are issued", () => {
      const results = [
        { CJSresultCode: 2651, ResultQualifierVariable: [] },
        { CJSresultCode: 2650, ResultQualifierVariable: [{ Code: "LB" }] }
      ] as Result[]

      const courtHouseName = getCourtHouseName(hearing, results)

      expect(courtHouseName).toBe("Dummy house name")
    })
  })
})
