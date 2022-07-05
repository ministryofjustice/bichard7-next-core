import { COMMON_LAWS, INDICTMENT } from "src/lib/properties"
import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"
import parseOffenceReason from "./parseOffenceReason"

const localOffenceReason: OffenceReason = {
  __type: "LocalOffenceReason",
  LocalOffenceCode: { AreaCode: "01", OffenceCode: "01CP001" }
}

const nationalCommonLawOffenceReason: OffenceReason = {
  __type: "NationalOffenceReason",
  OffenceCode: {
    __type: "CommonLawOffenceCode",
    CommonLawOffence: COMMON_LAWS,
    Reason: "ML001",
    Qualifier: "A",
    FullCode: `${COMMON_LAWS}001A`
  }
}

const nationalIndictmentOffenceReason: OffenceReason = {
  __type: "NationalOffenceReason",
  OffenceCode: {
    __type: "IndictmentOffenceCode",
    Indictment: INDICTMENT,
    Reason: "001",
    Qualifier: "B",
    FullCode: `${INDICTMENT}001B`
  }
}

const nationalNonMatchingOffenceReason: OffenceReason = {
  __type: "NationalOffenceReason",
  OffenceCode: {
    __type: "NonMatchingOffenceCode",
    ActOrSource: "CO",
    Year: "88",
    Reason: "88013",
    FullCode: "CO88013"
  }
}

describe("GIVEN parseOffence", () => {
  describe("WHEN parsing a national offenceCode", () => {
    it("THEN parse an offenceCode with a COMMON_LAWS prefix", () => {
      const commonLawOffenceCode = `${COMMON_LAWS}001A`
      const res = parseOffenceReason(commonLawOffenceCode, "01", nationalCommonLawOffenceReason)
      expect(res).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "CommonLawOffenceCode",
          CommonLawOffence: COMMON_LAWS,
          Reason: "001",
          Qualifier: "A",
          FullCode: `${COMMON_LAWS}001A`
        }
      })
    })

    it("THEN parse an offenceCode with a INDICTMENT prefix", () => {
      const indictmentOffenceCode = `${INDICTMENT}001B`
      const res = parseOffenceReason(indictmentOffenceCode, "01", nationalIndictmentOffenceReason)
      expect(res).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "IndictmentOffenceCode",
          Indictment: INDICTMENT,
          Reason: "001",
          Qualifier: "B",
          FullCode: `${INDICTMENT}001B`
        }
      })
    })

    it("THEN parse an offenceCode with NEITHER COMMON_LAWS or INDICTMENT prefix", () => {
      const nonMatchingOffenceCode = "CO88013"
      const res = parseOffenceReason(nonMatchingOffenceCode, "01", nationalNonMatchingOffenceReason)
      expect(res).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: "CO",
          Year: "88",
          Reason: "013",
          FullCode: "CO88013"
        }
      })
    })

    it('THEN parse a "Reason" for offenceCode.length > 4', () => {
      const nonMatchingOffenceCode = "CO88013"
      const res = parseOffenceReason(nonMatchingOffenceCode, "01", nationalNonMatchingOffenceReason)
      expect(res && "OffenceCode" in res && res.OffenceCode.Reason).toBe("013")
    })

    it('THEN parse "Qualifier" for offenceCode.length > 7', () => {
      const nonMatchingOffenceCode = "CO88013I"
      const parsedOffenceReason = parseOffenceReason(nonMatchingOffenceCode, "01", nationalNonMatchingOffenceReason)
      expect(
        parsedOffenceReason && "OffenceCode" in parsedOffenceReason && parsedOffenceReason.OffenceCode.Qualifier
      ).toBe("I")
    })
  })

  describe("WHEN parsing a local offence code", () => {
    it("THEN parse a local offence code", () => {
      const localOffenceCode = "01CP001"
      const res = parseOffenceReason(localOffenceCode, "01", localOffenceReason)

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
      const parsedOffenceReason = parseOffenceReason(nonMatchingOffenceCode, "01", localOffenceReason)
      expect(
        parsedOffenceReason &&
          "LocalOffenceCode" in parsedOffenceReason &&
          parsedOffenceReason.LocalOffenceCode.OffenceCode
      ).toBe("07DOG1")
    })
  })
})
