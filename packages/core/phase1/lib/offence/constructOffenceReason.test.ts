import type { OffenceReason } from "../../../types/AnnotatedHearingOutcome"

import { COMMON_LAWS, INDICTMENT } from "../../../lib/offenceTypes"
import constructOffenceReason from "./constructOffenceReason"

const localOffenceReason: OffenceReason = {
  __type: "LocalOffenceReason",
  LocalOffenceCode: { AreaCode: "01", OffenceCode: "01CP001" }
}

const nationalCommonLawOffenceReason: OffenceReason = {
  __type: "NationalOffenceReason",
  OffenceCode: {
    __type: "CommonLawOffenceCode",
    CommonLawOffence: COMMON_LAWS,
    FullCode: `${COMMON_LAWS}001A`,
    Qualifier: "A",
    Reason: "ML001"
  }
}

const nationalIndictmentOffenceReason: OffenceReason = {
  __type: "NationalOffenceReason",
  OffenceCode: {
    __type: "IndictmentOffenceCode",
    FullCode: `${INDICTMENT}001B`,
    Indictment: INDICTMENT,
    Qualifier: "B",
    Reason: "001"
  }
}

const nationalNonMatchingOffenceReason: OffenceReason = {
  __type: "NationalOffenceReason",
  OffenceCode: {
    __type: "NonMatchingOffenceCode",
    ActOrSource: "CO",
    FullCode: "CO88013",
    Reason: "88013",
    Year: "88"
  }
}

describe("GIVEN parseOffence", () => {
  describe("WHEN parsing a national offenceCode", () => {
    it("THEN parse an offenceCode with a COMMON_LAWS prefix", () => {
      const commonLawOffenceCode = `${COMMON_LAWS}001A`
      const res = constructOffenceReason(commonLawOffenceCode, "01", nationalCommonLawOffenceReason)
      expect(res).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "CommonLawOffenceCode",
          CommonLawOffence: COMMON_LAWS,
          FullCode: `${COMMON_LAWS}001A`,
          Qualifier: "A",
          Reason: "001"
        }
      })
    })

    it("THEN parse an offenceCode with a INDICTMENT prefix", () => {
      const indictmentOffenceCode = `${INDICTMENT}001B`
      const res = constructOffenceReason(indictmentOffenceCode, "01", nationalIndictmentOffenceReason)
      expect(res).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "IndictmentOffenceCode",
          FullCode: `${INDICTMENT}001B`,
          Indictment: INDICTMENT,
          Qualifier: "B",
          Reason: "001"
        }
      })
    })

    it("THEN parse an offenceCode with NEITHER COMMON_LAWS or INDICTMENT prefix", () => {
      const nonMatchingOffenceCode = "CO88013"
      const res = constructOffenceReason(nonMatchingOffenceCode, "01", nationalNonMatchingOffenceReason)
      expect(res).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: "CO",
          FullCode: "CO88013",
          Reason: "013",
          Year: "88"
        }
      })
    })

    it('THEN parse a "Reason" for offenceCode.length > 4', () => {
      const nonMatchingOffenceCode = "CO88013"
      const res = constructOffenceReason(nonMatchingOffenceCode, "01", nationalNonMatchingOffenceReason)
      expect(res && "OffenceCode" in res && res.OffenceCode.Reason).toBe("013")
    })

    it('THEN parse "Qualifier" for offenceCode.length > 7', () => {
      const nonMatchingOffenceCode = "CO88013I"
      const parsedOffenceReason = constructOffenceReason(nonMatchingOffenceCode, "01", nationalNonMatchingOffenceReason)
      expect(
        parsedOffenceReason && "OffenceCode" in parsedOffenceReason && parsedOffenceReason.OffenceCode.Qualifier
      ).toBe("I")
    })
  })

  describe("WHEN parsing a local offence code", () => {
    it("THEN parse a local offence code", () => {
      const localOffenceCode = "01CP001"
      const res = constructOffenceReason(localOffenceCode, "01", localOffenceReason)

      expect(res).toStrictEqual({
        __type: "LocalOffenceReason",
        LocalOffenceCode: {
          AreaCode: "01",
          OffenceCode: localOffenceCode
        }
      })
    })

    it('THEN parse "Qualifier" for offenceCode.length < 7', () => {
      const nonMatchingOffenceCode = "07DOG1"
      const parsedOffenceReason = constructOffenceReason(nonMatchingOffenceCode, "01", localOffenceReason)
      expect(
        parsedOffenceReason &&
          "LocalOffenceCode" in parsedOffenceReason &&
          parsedOffenceReason.LocalOffenceCode.OffenceCode
      ).toBe("07DOG1")
    })
  })
})
