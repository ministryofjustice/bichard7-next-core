import type { Operation } from "../../types/PncUpdateDataset"

import { PncOperation } from "../../types/PncOperation"
import generatePncUpdatedLogAttributes from "./generatePncUpdatedLogAttributes"

describe("generatePncUpdatedLogAttributes", () => {
  it("generates PNC updated log attributes from PNC operations", () => {
    const pncOperations: Operation[] = [
      {
        code: PncOperation.NORMAL_DISPOSAL,
        status: "Completed",
        data: {
          courtCaseReference: "97/1626/008395Q"
        }
      },
      {
        code: PncOperation.REMAND,
        status: "Completed",
        data: {
          nextHearingLocation: {
            TopLevelCode: "1",
            SecondLevelCode: "02",
            ThirdLevelCode: "03",
            BottomLevelCode: "04",
            OrganisationUnitCode: "1020304"
          },
          nextHearingDate: new Date("2025-01-30")
        }
      }
    ]

    const auditLogAttributes = generatePncUpdatedLogAttributes(pncOperations)

    expect(auditLogAttributes).toStrictEqual({
      "Number of Operations": 2,
      "Operation Code": "NEWREM"
    })
  })
})
