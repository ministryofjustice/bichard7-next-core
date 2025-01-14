import { isError } from "@moj-bichard7/common/types/Result"
import fs from "fs"
import path from "path"

import type { Operation, PncUpdateDataset } from "../../../types/PncUpdateDataset"

import { lookupOrganisationUnitByCode } from "../../../lib/dataLookup"
import parsePncUpdateDataSetXml from "../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import { PncOperation } from "../../../types/PncOperation"
import generatePncUpdateDatasetWithOperations from "../../tests/helpers/generatePncUpdateDatasetWithOperations"
import disposalUpdatedGenerator from "./disposalUpdatedGenerator"

jest.mock("../../../lib/dataLookup/lookupOrganisationUnitByCode")
const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.Mock

describe("disposalUpdatedGenerator", () => {
  beforeEach(() => {
    mockedLookupOrganisationUnitByCode.mockRestore()
    mockedLookupOrganisationUnitByCode.mockImplementation(
      jest.requireActual("../../../lib/dataLookup/lookupOrganisationUnitByCode").default
    )
  })

  it("generates the operation request", () => {
    const filePath = path.join(__dirname, "../../../phase2/tests/fixtures/PncUpdateDataSet-with-single-SUBVAR.xml")
    const inputXml = fs.readFileSync(filePath).toString()
    const pncUpdateDataset = parsePncUpdateDataSetXml(inputXml)
    if (isError(pncUpdateDataset)) {
      throw pncUpdateDataset
    }

    const result = disposalUpdatedGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.DISPOSAL_UPDATED>
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
          code: PncOperation.DISPOSAL_UPDATED,
          data: {
            courtCaseReference: "invalid"
          }
        }
      ]
    } as unknown as PncUpdateDataset

    const result = disposalUpdatedGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.DISPOSAL_UPDATED>
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

    const result = disposalUpdatedGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.DISPOSAL_UPDATED>
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
      code: PncOperation.DISPOSAL_UPDATED
    } as Operation<PncOperation.DISPOSAL_UPDATED>
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations([pncOperation])
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode = 4001

    const result = disposalUpdatedGenerator(pncUpdateDataset, pncOperation)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("PSA code 'I'm not a number' is not a number")
  })
})
