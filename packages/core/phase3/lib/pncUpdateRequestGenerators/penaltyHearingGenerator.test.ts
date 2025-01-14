import { isError } from "@moj-bichard7/common/types/Result"
import fs from "fs"
import path from "path"

import type { Operation } from "../../../types/PncUpdateDataset"

import { lookupOrganisationUnitByCode } from "../../../lib/dataLookup"
import parsePncUpdateDataSetXml from "../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import { PncOperation } from "../../../types/PncOperation"
import generatePncUpdateDatasetWithOperations from "../../tests/helpers/generatePncUpdateDatasetWithOperations"
import penaltyHearingGenerator from "./penaltyHearingGenerator"

jest.mock("../../../lib/dataLookup/lookupOrganisationUnitByCode")
const mockedLookupOrganisationUnitByCode = lookupOrganisationUnitByCode as jest.Mock

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
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
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
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations([pncOperation], {
      croNumber: "123",
      penaltyNoticeCaseReferenceNumber: "97/1626/008395Q"
    })
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode = 4001

    const result = penaltyHearingGenerator(pncUpdateDataset, pncOperation)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("PSA code 'I'm not a number' is not a number")
  })
})
