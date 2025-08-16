import { isError } from "@moj-bichard7/common/types/Result"

import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOperation } from "../../../../types/PncOperation"
import type { Operation } from "../../../../types/PncUpdateDataset"

import ResultClass from "@moj-bichard7/common/types/ResultClass"
import generatePncUpdateDatasetFromOffenceList from "../../../../phase2/tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import remandGenerator from "./remandGenerator"

const createPncUpdateDataset = () => {
  const offence = {
    OffenceCategory: "ZZ",
    Result: [
      {
        NextHearingDate: "2024-12-11T10:11:12.000Z",
        NextResultSourceOrganisation: {
          TopLevelCode: "B",
          SecondLevelCode: "00",
          ThirdLevelCode: "00",
          BottomLevelCode: "00",
          OrganisationUnitCode: "B000000"
        },
        PNCDisposalType: 2051,
        PNCAdjudicationExists: true,
        ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT,
        ResultQualifierVariable: [{ Code: "LE" }]
      }
    ] as Result[]
  } as Offence

  const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([offence])
  pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber =
    "1101ZD0100000410780J"
  pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing = new Date("2024-12-05")
  pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.RemandStatus = "CB"
  pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions = [
    "This is a dummy bail condition."
  ]
  pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
    TopLevelCode: "A",
    SecondLevelCode: "02",
    ThirdLevelCode: "BJ",
    BottomLevelCode: "01",
    OrganisationUnitCode: "A02BJ01"
  }
  pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtType = "MCA"
  pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseName = "Magistrates' Courts London Croydon"

  return pncUpdateDataset
}

const operation = {
  code: "NEWREM",
  data: {
    nextHearingDate: new Date("2024-12-11T10:11:12.000Z"),
    nextHearingLocation: {
      TopLevelCode: "B",
      SecondLevelCode: "00",
      ThirdLevelCode: "00",
      BottomLevelCode: "00",
      OrganisationUnitCode: "B000000"
    }
  }
} as Operation<PncOperation.REMAND>

const expectedRequest = {
  croNumber: null,
  forceStationCode: "02YZ",
  pncCheckName: null,
  pncIdentifier: null,
  arrestSummonsNumber: "11/01ZD/01/410780J",
  hearingDate: "05122024",
  nextHearingDate: "11122024",
  pncRemandStatus: "B",
  remandLocationCourt: "",
  psaCourtCode: "9998",
  courtNameType1: "Magistrates' Courts London Croydon MCA",
  courtNameType2: "Magistrates' Courts London Croydon MCA",
  localAuthorityCode: "0000",
  bailConditions: ["This is a dummy bail condition."]
}

describe("remandGenerator", () => {
  it("should generate remand request with all fields", () => {
    const pncUpdateDataset = createPncUpdateDataset()

    const result = remandGenerator(pncUpdateDataset, operation)

    expect(result).toStrictEqual({
      operation: "NEWREM",
      request: expectedRequest
    })
  })

  it.each(["PB", "PR"])(
    "should not return any bail conditions when PNC remand status is custody (%s)",
    (remandCjsCode) => {
      const pncUpdateDataset = createPncUpdateDataset()
      pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.RemandStatus = remandCjsCode

      const result = remandGenerator(pncUpdateDataset, operation)

      expect(result).toStrictEqual({
        operation: "NEWREM",
        request: {
          ...expectedRequest,
          pncRemandStatus: "C",
          bailConditions: []
        }
      })
    }
  )

  it("should use the correct court house name types when first instance warrant (LE) result qualifier exists and result code is undated warrant (4577)", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable =
      [{ Code: "LE" }]
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].CJSresultCode = 4577

    const result = remandGenerator(pncUpdateDataset, operation)

    expect(result).toStrictEqual({
      operation: "NEWREM",
      request: {
        ...expectedRequest,
        courtNameType1: "",
        courtNameType2: "*****1ST INSTANCE WARRANT ISSUED*****"
      }
    })
  })

  it("should use the correct court house names when first instance warrant (LE) result qualifier exists and result code is dated warrant (4575)", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable =
      [{ Code: "LE" }]
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].CJSresultCode = 4575

    const result = remandGenerator(pncUpdateDataset, operation)

    expect(result).toStrictEqual({
      operation: "NEWREM",
      request: {
        ...expectedRequest,
        remandLocationCourt: "9998",
        courtNameType1: "*****1ST INSTANCE DATED WARRANT ISSUED*****",
        courtNameType2: "*****1ST INSTANCE DATED WARRANT ISSUED***** MCA"
      }
    })
  })

  it("should use the correct court house code when first instance warrant (LE) result qualifier does not exist and result code is dated warrant (4575)", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].ResultQualifierVariable =
      []
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].CJSresultCode = 4575

    const result = remandGenerator(pncUpdateDataset, operation)

    expect(result).toStrictEqual({
      operation: "NEWREM",
      request: {
        ...expectedRequest,
        remandLocationCourt: "9998",
        courtNameType1: "***** FTA DATED WARRANT *****",
        courtNameType2: "***** FTA DATED WARRANT ***** MCA"
      }
    })
  })

  it("should throw error when there are no matching results", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].PNCDisposalType = 1000

    const result = remandGenerator(pncUpdateDataset, operation)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Could not find results to use for remand operation.")
  })
})
