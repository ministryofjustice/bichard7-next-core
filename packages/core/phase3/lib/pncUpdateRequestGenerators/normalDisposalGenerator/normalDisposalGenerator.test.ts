import { isError } from "@moj-bichard7/common/types/Result"

import type { Offence, OffenceReason, Result } from "../../../../types/AnnotatedHearingOutcome"
import type { Operation, PncUpdateDataset } from "../../../../types/PncUpdateDataset"
import type NormalDisposalPncUpdateRequest from "../../../types/NormalDisposalPncUpdateRequest"

import lookupOrganisationUnitByCode from "../../../../lib/dataLookup/lookupOrganisationUnitByCode"
import { PncOperation } from "../../../../types/PncOperation"
import ResultClass from "../../../../types/ResultClass"
import normalDisposalGenerator from "./normalDisposalGenerator"

jest.mock("../../../../lib/dataLookup/lookupOrganisationUnitByCode")
const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.Mock

const createPncUpdateDataset = () => {
  const offence = {
    OffenceCategory: "ZZ",
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: "RT",
          Year: "88",
          Reason: 191,
          FullCode: "RT88191"
        }
      } as unknown as OffenceReason
    },
    AddedByTheCourt: true,
    ActualOffenceStartDate: {
      StartDate: new Date("2025-01-01")
    },
    Result: [
      {
        NextHearingDate: "2024-12-11T10:11:12.000Z",
        NextResultSourceOrganisation: {
          TopLevelCode: "B",
          SecondLevelCode: "01",
          ThirdLevelCode: "00",
          BottomLevelCode: "00",
          OrganisationUnitCode: "B000000"
        },
        PNCDisposalType: 2059,
        PNCAdjudicationExists: true,
        ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
        ResultQualifierVariable: [{ Code: "LE" }]
      }
    ] as Result[]
  } as Offence

  const pncUpdateDataset = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: {
          DateOfHearing: new Date("2024-12-05"),
          CourtHearingLocation: {
            TopLevelCode: "B",
            SecondLevelCode: "01",
            ThirdLevelCode: "00",
            BottomLevelCode: "00",
            OrganisationUnitCode: "B000000"
          },
          CourtHouseName: "Magistrates' Courts London Croydon",
          CourtType: "MCA"
        },
        Case: {
          CourtCaseReferenceNumber: "97/1626/008395Q",
          ForceOwner: {
            TopLevelCode: "A",
            SecondLevelCode: "02",
            ThirdLevelCode: "BJ",
            BottomLevelCode: "01",
            OrganisationUnitCode: "A02BJ01"
          },
          HearingDefendant: {
            ArrestSummonsNumber: "1101ZD0100000410780J",
            BailConditions: ["This is a dummy bail condition."],
            Offence: [offence],
            RemandStatus: "CB"
          },
          PTIURN: "01ZD0303208"
        }
      }
    },
    Exceptions: [],
    PncOperations: []
  } as unknown as PncUpdateDataset

  return pncUpdateDataset
}

const operation = {
  code: "DISARR",
  data: {
    courtCaseReference: "97/1626/008395Q"
  }
} as Operation<PncOperation.NORMAL_DISPOSAL>

describe("normalDisposalGenerator", () => {
  beforeEach(() => {
    mockedLookupOrganisationUnitByCode.mockRestore()
  })

  it("should return error when ASN is invalid", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber =
      "1101ZD0100000410780JXX"

    const result = normalDisposalGenerator(pncUpdateDataset, operation)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Invalid ASN length. Length is 22")
  })

  it("should return error when court case reference in operation is invalid", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    const operationWithInvalidCourtCaseReference = {
      code: PncOperation.NORMAL_DISPOSAL,
      data: {
        courtCaseReference: "97/1626/008395"
      }
    } as Operation<PncOperation.NORMAL_DISPOSAL>

    const result = normalDisposalGenerator(pncUpdateDataset, operationWithInvalidCourtCaseReference)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Court Case Reference Number length must be 15, but the length is 14")
  })

  it("should return error when court case reference in operation does not exist and court case reference in hearing outcome is invalid", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    const operationWithoutCourtCaseReference = {
      code: PncOperation.NORMAL_DISPOSAL,
      data: undefined
    } as Operation<PncOperation.NORMAL_DISPOSAL>
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber = "97/1626/00839"

    const result = normalDisposalGenerator(pncUpdateDataset, operationWithoutCourtCaseReference)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Court Case Reference Number length must be 15, but the length is 13")
  })

  it("should return error when it fails to get PSA court code from the court hearing location", () => {
    const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.Mock

    mockedLookupOrganisationUnitByCode.mockReturnValue({
      bottomLevelCode: "00",
      bottomLevelName: "",
      secondLevelCode: "20",
      secondLevelName: "West Midlands",
      thirdLevelCode: "BN",
      thirdLevelName: "Birmingham Youth Court (Steelehouse Lane)",
      thirdLevelPsaCode: "I'm not a number",
      topLevelCode: "B",
      topLevelName: "Magistrates' Courts"
    })

    const pncUpdateDataset = createPncUpdateDataset()
    const operationWithoutCourtCaseReference = {
      code: PncOperation.NORMAL_DISPOSAL,
      data: undefined
    } as Operation<PncOperation.NORMAL_DISPOSAL>
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode = 4001

    const result = normalDisposalGenerator(pncUpdateDataset, operationWithoutCourtCaseReference)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("PSA code 'I'm not a number' is not a number")
  })

  it("should return error when it fails to get PSA court code from the next result source organisation", () => {
    mockedLookupOrganisationUnitByCode.mockReturnValueOnce({
      bottomLevelCode: "00",
      bottomLevelName: "",
      secondLevelCode: "20",
      secondLevelName: "West Midlands",
      thirdLevelCode: "BN",
      thirdLevelName: "Birmingham Youth Court (Steelehouse Lane)",
      thirdLevelPsaCode: "2525",
      topLevelCode: "B",
      topLevelName: "Magistrates' Courts"
    })

    mockedLookupOrganisationUnitByCode.mockReturnValueOnce({
      bottomLevelCode: "00",
      bottomLevelName: "",
      secondLevelCode: "20",
      secondLevelName: "West Midlands",
      thirdLevelCode: "BN",
      thirdLevelName: "Birmingham Youth Court (Steelehouse Lane)",
      thirdLevelPsaCode: "I'm not a number 2",
      topLevelCode: "B",
      topLevelName: "Magistrates' Courts"
    })

    const pncUpdateDataset = createPncUpdateDataset()
    const operationWithoutCourtCaseReference = {
      code: PncOperation.NORMAL_DISPOSAL,
      data: undefined
    } as Operation<PncOperation.NORMAL_DISPOSAL>
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode = 4001

    const result = normalDisposalGenerator(pncUpdateDataset, operationWithoutCourtCaseReference)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("PSA code 'I'm not a number 2' is not a number")
  })

  it("should not set ASN and arrests adjudications and disposals when there are no offences added by the court with results compatible with disposals", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].AddedByTheCourt = false

    const result = normalDisposalGenerator(pncUpdateDataset, operation)

    expect((result as NormalDisposalPncUpdateRequest).request.arrestSummonsNumber).toBeNull()
    expect(result).toMatchSnapshot()
  })

  it("should set ASN and arrests adjudications and disposals when there is an offence added by the court with results compatible with disposals", () => {
    const pncUpdateDataset = createPncUpdateDataset()

    const result = normalDisposalGenerator(pncUpdateDataset, operation)

    expect((result as NormalDisposalPncUpdateRequest).request.arrestSummonsNumber).toBe("11/01ZD/01/410780J")
    expect(result).toMatchSnapshot()
  })

  it("should set PTIURN (Pre Trial Issues Unique Reference Number) when case requires RCC and has reportable offences", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    const offence = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    const offence2 = structuredClone(offence)
    offence2.Result[0].PNCDisposalType = 2060
    const offence3 = structuredClone(offence)
    offence3.Result[0].PNCDisposalType = 2061
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.push(offence2, offence3)

    const result = normalDisposalGenerator(pncUpdateDataset, operation)

    expect((result as NormalDisposalPncUpdateRequest).request.preTrialIssuesUniqueReferenceNumber).toBe("01ZD/0303208")
    expect(result).toMatchSnapshot()
  })
})
