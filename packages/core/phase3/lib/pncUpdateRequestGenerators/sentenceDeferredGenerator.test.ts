import { isError } from "@moj-bichard7/common/types/Result"
import fs from "fs"
import path from "path"

import type { Offence, OffenceReason, Result } from "../../../types/AnnotatedHearingOutcome"
import type { Operation, PncUpdateDataset } from "../../../types/PncUpdateDataset"

import { lookupOrganisationUnitByCode } from "../../../lib/dataLookup"
import parsePncUpdateDataSetXml from "../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import { PncOperation } from "../../../types/PncOperation"
import ResultClass from "../../../types/ResultClass"
import sentenceDeferredGenerator from "./sentenceDeferredGenerator"

jest.mock("../../../lib/dataLookup/lookupOrganisationUnitByCode")
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

describe("sentenceDeferredGenerator", () => {
  beforeEach(() => {
    mockedLookupOrganisationUnitByCode.mockRestore()
    mockedLookupOrganisationUnitByCode.mockImplementation(
      jest.requireActual("../../../lib/dataLookup/lookupOrganisationUnitByCode").default
    )
  })

  it("generates the operation request", () => {
    const filePath = path.join(__dirname, "../../../phase2/tests/fixtures/PncUpdateDataSet-with-operations.xml")
    const inputXml = fs.readFileSync(filePath).toString()
    const pncUpdateDataset = parsePncUpdateDataSetXml(inputXml)
    if (isError(pncUpdateDataset)) {
      throw pncUpdateDataset
    }

    const result = sentenceDeferredGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[2] as Operation<PncOperation.SENTENCE_DEFERRED>
    )

    expect(result).toMatchSnapshot()
  })

  it("should return error when court case reference in operation is invalid", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {},
          Hearing: {}
        }
      },
      Exceptions: [],
      PncOperations: [
        {
          code: PncOperation.SENTENCE_DEFERRED,
          data: {
            courtCaseReference: "invalid"
          }
        }
      ]
    } as unknown as PncUpdateDataset

    const result = sentenceDeferredGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.SENTENCE_DEFERRED>
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Court Case Reference Number length must be 15, but the length is 7")
  })

  it("should return error when court case reference in hearing outcome case is invalid", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            CourtCaseReferenceNumber: "invalid2"
          },
          Hearing: {}
        }
      },
      Exceptions: [],
      PncOperations: [
        {
          code: PncOperation.DISPOSAL_UPDATED
        }
      ]
    } as unknown as PncUpdateDataset

    const result = sentenceDeferredGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.SENTENCE_DEFERRED>
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Court Case Reference Number length must be 15, but the length is 8")
  })

  it("should return error when it fails to get PSA court code from court hearing location", () => {
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

    const pncOperation = {
      code: PncOperation.SENTENCE_DEFERRED
    } as Operation<PncOperation.SENTENCE_DEFERRED>
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode = 4001

    const result = sentenceDeferredGenerator(pncUpdateDataset, pncOperation)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("PSA code 'I'm not a number' is not a number")
  })
})
