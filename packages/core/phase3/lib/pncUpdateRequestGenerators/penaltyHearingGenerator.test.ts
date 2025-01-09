import { isError } from "@moj-bichard7/common/types/Result"
import fs from "fs"
import path from "path"

import type { Offence, OffenceReason, Result } from "../../../types/AnnotatedHearingOutcome"
import type { Operation, PncUpdateDataset } from "../../../types/PncUpdateDataset"

import { lookupOrganisationUnitByCode } from "../../../lib/dataLookup"
import parsePncUpdateDataSetXml from "../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import { PncOperation } from "../../../types/PncOperation"
import ResultClass from "../../../types/ResultClass"
import penaltyHearingGenerator from "./penaltyHearingGenerator"

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
            RemandStatus: "CB",
            CRONumber: "123"
          },
          PTIURN: "01ZD0303208",
          PenaltyNoticeCaseReferenceNumber: "97/1626/008395Q"
        }
      }
    },
    Exceptions: [],
    PncOperations: []
  } as unknown as PncUpdateDataset

  return pncUpdateDataset
}

describe("penaltyHearingGenerator", () => {
  beforeEach(() => {
    mockedLookupOrganisationUnitByCode.mockRestore()
    mockedLookupOrganisationUnitByCode.mockImplementation(
      jest.requireActual("../../../lib/dataLookup/lookupOrganisationUnitByCode").default
    )
  })

  it("generates the operation request", () => {
    const filePath = path.join(__dirname, "../../../phase2/tests/fixtures/PncUpdateDataSet-with-single-PENHRG.xml")
    const inputXml = fs.readFileSync(filePath).toString()
    const pncUpdateDataset = parsePncUpdateDataSetXml(inputXml)
    if (isError(pncUpdateDataset)) {
      throw pncUpdateDataset
    }

    const result = penaltyHearingGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.PENALTY_HEARING>
    )

    expect(result).toMatchSnapshot()
  })

  it("should return error when court case reference in operation and penalty notice case reference number in hearing outcome are undefined", () => {
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.PncOperations = [
      {
        code: PncOperation.PENALTY_HEARING,
        data: undefined
      } as Operation<PncOperation.PENALTY_HEARING>
    ]
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined

    const result = penaltyHearingGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.PENALTY_HEARING>
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Penalty notice case ref is missing")
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
      code: PncOperation.PENALTY_HEARING
    } as Operation<PncOperation.PENALTY_HEARING>
    const pncUpdateDataset = createPncUpdateDataset()
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode = 4001

    const result = penaltyHearingGenerator(pncUpdateDataset, pncOperation)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("PSA code 'I'm not a number' is not a number")
  })
})
